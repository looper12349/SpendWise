const mongoose = require('mongoose');

const budgetCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: [
            'food',
            'transport',
            'shopping',
            'entertainment',
            'bills',
            'health',
            'education',
            'travel',
            'groceries',
            'other'
        ]
    },
    limit: {
        type: Number,
        required: true,
        min: 0
    }
});

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    totalLimit: {
        type: Number,
        required: true,
        min: 0
    },
    categoryLimits: [budgetCategorySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for unique budget per user per month
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
