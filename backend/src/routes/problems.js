const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Problem = require('../models/Problem');
const { auth, adminAuth } = require('../middleware/auth');

// Get all problems
router.get('/', auth, async (req, res) => {
    try {
        const { difficulty, tags, search } = req.query;
        const query = {};

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const problems = await Problem.find(query)
            .select('-testCases')
            .sort({ createdAt: -1 });

        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get problem by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new problem (admin only)
router.post('/', [
    auth,
    adminAuth,
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('difficulty').isIn(['easy', 'medium', 'hard']),
    body('testCases').isArray(),
    body('testCases.*.input').notEmpty(),
    body('testCases.*.output').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const problem = new Problem({
            ...req.body,
            createdBy: req.user._id
        });

        await problem.save();
        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update problem (admin only)
router.put('/:id', [
    auth,
    adminAuth,
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    body('testCases').optional().isArray()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        Object.assign(problem, req.body);
        await problem.save();

        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete problem (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        await problem.remove();
        res.json({ message: 'Problem deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 