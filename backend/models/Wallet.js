const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

const splitSchema = new mongoose.Schema({
    expense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        required: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    splits: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        settled: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a wallet name'],
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    type: {
        type: String,
        enum: ['roommates', 'couple', 'trip', 'group', 'other'],
        default: 'group'
    },
    members: [memberSchema],
    splits: [splitSchema],
    totalExpenses: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster member lookups
walletSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Wallet', walletSchema);
