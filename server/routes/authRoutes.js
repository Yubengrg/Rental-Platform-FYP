const express = require('express');
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', loginValidation, validate, AuthController.login);

// Protected routes
router.get('/me', auth, AuthController.getMe);
router.post('/logout', auth, AuthController.logout);

module.exports = router;