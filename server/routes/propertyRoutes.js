const express = require('express');
const PropertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');
const { body, query, validate } = require('../middleware/validation');

const router = express.Router();

// Property validation rules
const createPropertyValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  
  body('propertyType')
    .isIn(['apartment', 'house', 'condo', 'studio', 'room'])
    .withMessage('Property type must be apartment, house, condo, studio, or room'),
  
  body('totalRooms')
    .isInt({ min: 1 })
    .withMessage('Total rooms must be at least 1'),
  
  body('availableRooms')
    .isInt({ min: 0 })
    .withMessage('Available rooms cannot be negative'),
  
  body('bathrooms')
    .isInt({ min: 1 })
    .withMessage('Bathrooms must be at least 1'),
  
  body('rent')
    .isFloat({ min: 0 })
    .withMessage('Rent must be a positive number'),
  
  body('deposit')
    .isFloat({ min: 0 })
    .withMessage('Deposit must be a positive number'),
  
  body('availableFrom')
    .isISO8601()
    .withMessage('Available from must be a valid date')
];

const updatePropertyValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  
  body('rent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rent must be a positive number'),
  
  body('deposit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Deposit must be a positive number')
];

const searchQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('minRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum rent must be a positive number'),
  
  query('maxRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum rent must be a positive number')
];

// Public routes - CORRECT ORDER (specific routes BEFORE parameterized routes)
router.get('/', searchQueryValidation, validate, PropertyController.getAllProperties);
router.get('/stats', PropertyController.getPropertyStats);
router.post('/search', PropertyController.searchProperties);
router.get('/landlord/:landlordId', PropertyController.getPropertiesByLandlord);

// Protected routes - Individual auth middleware
router.post('/', auth, createPropertyValidation, validate, PropertyController.createProperty);
router.get('/my-properties', auth, PropertyController.getMyProperties);

// Parameterized routes LAST
router.get('/:id', PropertyController.getPropertyById);
router.put('/:id', auth, updatePropertyValidation, validate, PropertyController.updateProperty);
router.delete('/:id', auth, PropertyController.deleteProperty);

module.exports = router;