const User = require('../models/user.model');
const UserData = require('../models/userData.model');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/HR usually, but public for now as per request)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile (with UserData)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const userData = await UserData.findOne({ userId: req.user.id })
      .populate('jobRole', 'postName companyName description'); // Assuming companyName might be added or postName is enough

    if (!userData) {
      res.status(404);
      throw new Error('User profile data not found');
    }

    res.json(userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserProfile
};
