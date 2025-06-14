const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    testCases: [{
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },
        isExample: {
            type: Boolean,
            default: false
        }
    }],
    constraints: {
        timeLimit: {
            type: Number,
            required: true,
            default: 1000 // in milliseconds
        },
        memoryLimit: {
            type: Number,
            required: true,
            default: 256 // in MB
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
problemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Problem', problemSchema); 