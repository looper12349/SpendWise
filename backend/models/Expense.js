const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        default: null
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
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
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'upi', 'other'],
        default: 'cash'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
