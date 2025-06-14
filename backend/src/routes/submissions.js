const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { auth } = require('../middleware/auth');
const { createContainer } = require('../utils/docker');

// Compile and run code
router.post('/compile', [
    body('code').notEmpty(),
    body('language').isIn(['cpp', 'python', 'java']),
    body('input').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { code, language, input } = req.body;

        const result = await createContainer(language, code, input);
        
        if (result.error) {
            return res.json({ error: result.error });
        }

        res.json({ output: result.output });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's submissions
router.get('/', auth, async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user._id })
            .populate('problem', 'title difficulty')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get submission by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('problem')
            .populate('user', 'username');
        
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Check if user owns the submission or is admin
        if (submission.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit code
router.post('/', [
    auth,
    body('problemId').notEmpty(),
    body('code').notEmpty(),
    body('language').isIn(['cpp', 'python', 'java'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { problemId, code, language } = req.body;

        // Find problem
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // Create submission
        const submission = new Submission({
            user: req.user._id,
            problem: problemId,
            code,
            language,
            totalTestCases: problem.testCases.length
        });

        await submission.save();

        // Execute code for each test case
        let passedTestCases = 0;
        let executionTime = 0;
        let memoryUsed = 0;

        for (const testCase of problem.testCases) {
            try {
                const result = await createContainer(language, code, testCase.input);
                
                if (result.error) {
                    submission.status = 'runtime_error';
                    submission.error = result.error;
                    break;
                }

                const output = result.output.trim();
                const expectedOutput = testCase.output.trim();

                if (output === expectedOutput) {
                    passedTestCases++;
                } else {
                    submission.status = 'wrong_answer';
                    break;
                }

                executionTime = Math.max(executionTime, result.executionTime);
                memoryUsed = Math.max(memoryUsed, result.memoryUsed);

            } catch (error) {
                submission.status = 'runtime_error';
                submission.error = error.message;
                break;
            }
        }

        // Update submission status
        if (submission.status === 'pending') {
            submission.status = passedTestCases === problem.testCases.length ? 'accepted' : 'wrong_answer';
        }

        submission.testCasesPassed = passedTestCases;
        submission.executionTime = executionTime;
        submission.memoryUsed = memoryUsed;

        await submission.save();

        // Update problem statistics
        problem.submissions.push(submission._id);
        await problem.save();

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 