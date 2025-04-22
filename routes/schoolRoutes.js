const express = require('express');
const { body, validationResult } = require('express-validator');
const schoolController = require('../controllers/schoolController');

const router = express.Router();

// Validation middleware (Created a validation middleware to validate the school data)
const validateSchoolData = [
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('latitude').optional().isFloat().withMessage('Valid latitude is required'),
    body('longitude').optional().isFloat().withMessage('Valid longitude is required')
];

// Middleware to check validation results (Created a middleware to check validation results)
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Routes(Created an additional route for address suggestions)
router.post('/addSchool', validateSchoolData, validate, schoolController.addSchool);
router.get('/listSchools', schoolController.listSchools);
router.get('/address-suggestions', schoolController.getAddressSuggestions);

module.exports = router; 