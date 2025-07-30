// ============ SERVER/CONTROLLERS/AUTHCONTROLLER.JS (WITH DEBUG) ============
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiResponse = require('../utils/response');

class AuthController {
  // @desc    Register a new user
  // @route   POST /api/auth/register
  // @access  Public
  static async register(req, res) {
    try {
      console.log('📝 Registration request received');
      console.log('📦 Request body:', req.body);
      
      const { firstName, lastName, email, password, userType } = req.body;

      // Enhanced validation logging
      if (!firstName) {
        console.log('❌ Missing firstName');
        return ApiResponse.error(res, 'First name is required', 400);
      }
      if (!lastName) {
        console.log('❌ Missing lastName');
        return ApiResponse.error(res, 'Last name is required', 400);
      }
      if (!email) {
        console.log('❌ Missing email');
        return ApiResponse.error(res, 'Email is required', 400);
      }
      if (!password) {
        console.log('❌ Missing password');
        return ApiResponse.error(res, 'Password is required', 400);
      }

      console.log('✅ Basic validation passed');

      // Check if user already exists
      console.log('🔍 Checking if user exists with email:', email);
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        console.log('❌ User already exists');
        return ApiResponse.error(res, 'User with this email already exists', 400);
      }

      console.log('✅ User does not exist, creating new user');

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        userType: userType || 'tenant'
      });

      console.log('💾 Saving user to database...');
      await user.save();
      console.log('✅ User saved successfully');

      // Generate token
      console.log('🔑 Generating JWT token...');
      const token = generateToken(user._id);
      console.log('✅ Token generated');

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      console.log('✅ Registration successful');
      return ApiResponse.success(res, {
        user: userResponse,
        token
      }, 'User registered successfully', 201);

    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error stack:', error.stack);
      
      if (error.name === 'ValidationError') {
        console.log('❌ Mongoose validation error');
        const messages = Object.values(error.errors).map(err => err.message);
        console.log('❌ Validation messages:', messages);
        return ApiResponse.error(res, messages.join(', '), 400);
      }

      return ApiResponse.error(res, 'Server error during registration', 500);
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  static async login(req, res) {
    try {
      console.log('🔑 Login request received');
      console.log('📦 Request body:', req.body);
      
      const { email, password } = req.body;

      if (!email || !password) {
        console.log('❌ Missing email or password');
        return ApiResponse.error(res, 'Email and password are required', 400);
      }

      // Find user and include password for comparison
      console.log('🔍 Finding user with email:', email);
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user) {
        console.log('❌ User not found');
        return ApiResponse.unauthorized(res, 'Invalid email or password');
      }

      // Check if account is active
      if (!user.isActive) {
        console.log('❌ Account is inactive');
        return ApiResponse.unauthorized(res, 'Account is deactivated. Please contact support.');
      }

      // Check password
      console.log('🔐 Checking password...');
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        console.log('❌ Password incorrect');
        return ApiResponse.unauthorized(res, 'Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      console.log('✅ Login successful');
      return ApiResponse.success(res, {
        user: userResponse,
        token
      }, 'Login successful');

    } catch (error) {
      console.error('❌ Login error:', error);
      return ApiResponse.error(res, 'Server error during login', 500);
    }
  }

  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  static async getMe(req, res) {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      return ApiResponse.success(res, { user }, 'User data retrieved successfully');
      
    } catch (error) {
      console.error('Get user error:', error);
      return ApiResponse.error(res, 'Server error while fetching user data');
    }
  }

  // @desc    Logout user
  // @route   POST /api/auth/logout
  // @access  Private
  static async logout(req, res) {
    try {
      return ApiResponse.success(res, null, 'Logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      return ApiResponse.error(res, 'Server error during logout');
    }
  }
}

module.exports = AuthController;