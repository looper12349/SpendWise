const express = require('express');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get all budgets for user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id })
            .sort({ year: -1, month: -1 });

        res.json({
            success: true,
            count: budgets.length,
            data: budgets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/budgets/current
// @desc    Get current month's budget with spending
// @access  Private
router.get('/current', protect, async (req, res) => {
    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        let budget = await Budget.findOne({
            user: req.user._id,
            month,
            year
        });

        // Get current month expenses
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);

        const expenses = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    wallet: null,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalSpent = expenses.reduce((acc, exp) => acc + exp.total, 0);

        res.json({
            success: true,
            data: {
                budget,
                spending: {
                    total: totalSpent,
                    byCategory: expenses
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/budgets
// @desc    Create or update budget for a month
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { month, year, totalLimit, categoryLimits } = req.body;

        // Upsert budget
        const budget = await Budget.findOneAndUpdate(
            { user: req.user._id, month, year },
            { totalLimit, categoryLimits },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({
            success: true,
            data: budget
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete budget
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        await budget.deleteOne();

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
