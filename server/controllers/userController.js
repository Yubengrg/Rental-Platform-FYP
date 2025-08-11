const User = require('../models/User');
const ApiResponse = require('../utils/response');
const bcrypt = require('bcryptjs');

class UserController {
  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  static async updateProfile(req, res) {
    try {
      const allowedUpdates = [
        'firstName', 'lastName', 'phone', 'dateOfBirth', 'gender',
        'bio', 'occupation', 'university', 'lifestyle'
      ];
      
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return ApiResponse.error(res, 'Invalid updates', 400);
      }

      const user = await User.findById(req.user._id);
      
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      updates.forEach(update => {
        if (update === 'lifestyle' && req.body.lifestyle) {
          user.lifestyle = { ...user.lifestyle.toObject(), ...req.body.lifestyle };
        } else {
          user[update] = req.body[update];
        }
      });

      await user.save();

      return ApiResponse.success(res, { user }, 'Profile updated successfully');

    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return ApiResponse.error(res, messages.join(', '), 400);
      }

      return ApiResponse.error(res, 'Server error while updating profile');
    }
  }

  // @desc    Change user password
  // @route   PUT /api/users/change-password
  // @access  Private
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return ApiResponse.error(res, 'Please provide current password and new password', 400);
      }

      if (newPassword.length < 6) {
        return ApiResponse.error(res, 'New password must be at least 6 characters long', 400);
      }

      // Find user with password field
      const user = await User.findById(req.user._id).select('+password');
      
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      // Check current password
      const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordCorrect) {
        return ApiResponse.error(res, 'Current password is incorrect', 400);
      }

      // Update password (will be hashed by pre-save middleware)
      user.password = newPassword;
      await user.save();

      return ApiResponse.success(res, null, 'Password changed successfully');

    } catch (error) {
      console.error('Change password error:', error);
      return ApiResponse.error(res, 'Server error while changing password');
    }
  }

  // @desc    Upload profile picture
  // @route   PUT /api/users/profile-picture
  // @access  Private
  static async uploadProfilePicture(req, res) {
    try {
      const { profilePicture } = req.body;

      if (!profilePicture) {
        return ApiResponse.error(res, 'Profile picture URL is required', 400);
      }

      const user = await User.findById(req.user._id);
      
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      user.profilePicture = profilePicture;
      await user.save();

      return ApiResponse.success(res, { user }, 'Profile picture updated successfully');

    } catch (error) {
      console.error('Upload profile picture error:', error);
      return ApiResponse.error(res, 'Server error while uploading profile picture');
    }
  }

  // @desc    Get user by ID
  // @route   GET /api/users/:id
  // @access  Private
  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user || !user.isActive) {
        return ApiResponse.notFound(res, 'User not found');
      }

      return ApiResponse.success(res, { user }, 'User retrieved successfully');

    } catch (error) {
      console.error('Get user by ID error:', error);
      return ApiResponse.error(res, 'Server error while fetching user');
    }
  }

  // @desc    Deactivate account
  // @route   PUT /api/users/deactivate
  // @access  Private
  static async deactivateAccount(req, res) {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      user.isActive = false;
      await user.save();

      return ApiResponse.success(res, null, 'Account deactivated successfully');

    } catch (error) {
      console.error('Deactivate account error:', error);
      return ApiResponse.error(res, 'Server error while deactivating account');
    }
  }
}

module.exports = UserController;