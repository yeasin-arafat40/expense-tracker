// server/controllers/budgetController.js
import Budget from '../models/Budget.js';

// @desc    Get or create budget for a month
// @route   GET /api/budget/:month
// @access  Private
export const getBudget = async (req, res) => {
  try {
    const { month } = req.params;
    let budget = await Budget.findOne({ userId: req.user._id, month });

    if (!budget) {
      budget = await Budget.create({
        userId: req.user._id,
        month,
      });
    }

    res.status(200).json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update budget
// @route   POST /api/budget
// @access  Private
export const upsertBudget = async (req, res) => {
  try {
    const { month, totalBudget, categoryBudgets } = req.body;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month is required',
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month },
      {
        userId: req.user._id,
        month,
        totalBudget: totalBudget || 0,
        categoryBudgets: categoryBudgets || {},
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Budget saved successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};