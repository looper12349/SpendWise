const express = require('express');
const Wallet = require('../models/Wallet');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/wallets
// @desc    Get all wallets user is part of
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const wallets = await Wallet.find({ 'members.user': req.user._id })
            .populate('members.user', 'name email avatar')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: wallets.length,
            data: wallets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/wallets/:id
// @desc    Get single wallet with balances
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id)
            .populate('members.user', 'name email avatar')
            .populate('splits.paidBy', 'name email')
            .populate('splits.splits.user', 'name email');

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        // Check if user is a member
        const isMember = wallet.members.some(m =>
            m.user._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this wallet'
            });
        }

        // Get wallet expenses
        const expenses = await Expense.find({ wallet: wallet._id })
            .populate('user', 'name email')
            .sort({ date: -1 });

        // Calculate balances
        const balances = {};
        wallet.members.forEach(m => {
            balances[m.user._id.toString()] = {
                user: m.user,
                paid: 0,        // Total amount this person paid
                share: 0,       // Total amount this person should pay (their fair share)
                balance: 0
            };
        });

        // Calculate how much each person paid and their fair share
        wallet.splits.forEach(split => {
            const paidById = split.paidBy._id.toString();
            
            // Calculate total expense amount for this split
            const totalExpense = split.splits.reduce((sum, s) => sum + s.amount, 0);
            
            // Add to payer's "paid" amount
            balances[paidById].paid += totalExpense;
            
            // Add each person's share to their "share" amount
            split.splits.forEach(s => {
                const userId = s.user._id.toString();
                balances[userId].share += s.amount;
            });
        });

        // Calculate net balance (positive = gets back, negative = owes)
        Object.keys(balances).forEach(userId => {
            balances[userId].balance = balances[userId].paid - balances[userId].share;
        });

        res.json({
            success: true,
            data: {
                wallet,
                expenses,
                balances: Object.values(balances)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/wallets
// @desc    Create new wallet
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, type } = req.body;

        const wallet = await Wallet.create({
            name,
            description,
            type,
            createdBy: req.user._id,
            members: [{ user: req.user._id, role: 'admin' }]
        });

        await wallet.populate('members.user', 'name email avatar');

        res.status(201).json({
            success: true,
            data: wallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/wallets/:id/members
// @desc    Add member to wallet
// @access  Private
router.post('/:id/members', protect, async (req, res) => {
    try {
        const { email } = req.body;

        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        // Check if user is admin
        const member = wallet.members.find(m =>
            m.user.toString() === req.user._id.toString()
        );
        if (!member || member.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can add members'
            });
        }

        // Find user by email
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already a member
        const alreadyMember = wallet.members.some(m =>
            m.user.toString() === userToAdd._id.toString()
        );
        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message: 'User is already a member'
            });
        }

        wallet.members.push({ user: userToAdd._id, role: 'member' });
        await wallet.save();
        await wallet.populate('members.user', 'name email avatar');

        res.json({
            success: true,
            data: wallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/wallets/:id/expenses
// @desc    Add expense to wallet and split
// @access  Private
router.post('/:id/expenses', protect, async (req, res) => {
    try {
        const { amount, category, description, splitType = 'equal' } = req.body;

        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        // Check if user is a member
        const isMember = wallet.members.some(m =>
            m.user.toString() === req.user._id.toString()
        );
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Create expense
        const expense = await Expense.create({
            user: req.user._id,
            wallet: wallet._id,
            amount,
            category,
            description,
            date: Date.now()
        });

        // Create split (equal by default)
        const memberCount = wallet.members.length;
        const splitAmount = amount / memberCount;

        const splits = wallet.members.map(m => ({
            user: m.user,
            amount: splitAmount,
            settled: m.user.toString() === req.user._id.toString()
        }));

        wallet.splits.push({
            expense: expense._id,
            paidBy: req.user._id,
            splits
        });

        wallet.totalExpenses += amount;
        await wallet.save();

        res.status(201).json({
            success: true,
            data: { expense, wallet }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/wallets/:id/settle/:splitId/:userId
// @desc    Settle a user's split
// @access  Private
router.put('/:id/settle/:splitId/:userId', protect, async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        const split = wallet.splits.id(req.params.splitId);
        if (!split) {
            return res.status(404).json({
                success: false,
                message: 'Split not found'
            });
        }

        const userSplit = split.splits.find(s =>
            s.user.toString() === req.params.userId
        );
        if (!userSplit) {
            return res.status(404).json({
                success: false,
                message: 'User split not found'
            });
        }

        userSplit.settled = true;
        await wallet.save();

        res.json({
            success: true,
            data: wallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/wallets/:id
// @desc    Delete wallet
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        // Check if user is admin
        const member = wallet.members.find(m =>
            m.user.toString() === req.user._id.toString()
        );
        if (!member || member.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete wallets'
            });
        }

        // Delete associated expenses
        await Expense.deleteMany({ wallet: wallet._id });
        await wallet.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
