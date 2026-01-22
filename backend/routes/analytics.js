const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get expense overview stats
// @access  Private
router.get('/overview', protect, async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // Current month total
        const currentMonthExpenses = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    wallet: null,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Last month total
        const lastMonthExpenses = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    wallet: null,
                    date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Today's expenses
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        const todayExpenses = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    wallet: null,
                    date: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Total expenses count
        const totalCount = await Expense.countDocuments({
            user: req.user._id,
            wallet: null
        });

        const currentTotal = currentMonthExpenses[0]?.total || 0;
        const lastTotal = lastMonthExpenses[0]?.total || 0;
        const percentChange = lastTotal > 0
            ? ((currentTotal - lastTotal) / lastTotal) * 100
            : 0;

        res.json({
            success: true,
            data: {
                currentMonth: currentTotal,
                lastMonth: lastTotal,
                today: todayExpenses[0]?.total || 0,
                totalExpenses: totalCount,
                percentChange: Math.round(percentChange * 100) / 100
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/analytics/by-category
// @desc    Get expenses grouped by category
// @access  Private
router.get('/by-category', protect, async (req, res) => {
    try {
        const { month, year } = req.query;
        const now = new Date();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
        const targetYear = year ? parseInt(year) : now.getFullYear();

        const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
        const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);

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
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const total = expenses.reduce((acc, exp) => acc + exp.total, 0);

        const data = expenses.map(exp => ({
            category: exp._id,
            amount: exp.total,
            count: exp.count,
            percentage: total > 0 ? Math.round((exp.total / total) * 100) : 0
        }));

        res.json({
            success: true,
            data: {
                categories: data,
                total,
                month: targetMonth,
                year: targetYear
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/analytics/monthly-trend
// @desc    Get monthly expense trend
// @access  Private
router.get('/monthly-trend', protect, async (req, res) => {
    try {
        const { months = 6 } = req.query;
        const now = new Date();

        const pipeline = [];
        for (let i = parseInt(months) - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            pipeline.push({
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                label: date.toLocaleString('default', { month: 'short' })
            });
        }

        const results = await Promise.all(
            pipeline.map(async (p) => {
                const startOfMonth = new Date(p.year, p.month - 1, 1);
                const endOfMonth = new Date(p.year, p.month, 0, 23, 59, 59);

                const result = await Expense.aggregate([
                    {
                        $match: {
                            user: req.user._id,
                            wallet: null,
                            date: { $gte: startOfMonth, $lte: endOfMonth }
                        }
                    },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ]);

                return {
                    ...p,
                    total: result[0]?.total || 0
                };
            })
        );

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/analytics/daily
// @desc    Get daily expenses for current month
// @access  Private
router.get('/daily', protect, async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

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
                    _id: { $dayOfMonth: '$date' },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: expenses.map(e => ({
                day: e._id,
                total: e.total,
                count: e.count
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
