const express = require('express');
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// User profile routes
router.put('/profile', UserController.updateProfile);
router.put('/change-password', UserController.changePassword);
router.put('/profile-picture', UserController.uploadProfilePicture);
router.put('/deactivate', UserController.deactivateAccount);
router.get('/:id', UserController.getUserById);

module.exports = router;