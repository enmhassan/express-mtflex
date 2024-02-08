const { body } = require('express-validator');


exports.registerValidator = [
    body('email')
        .isEmail().withMessage('Invalid email')
        .normalizeEmail({ gmail_remove_dots: true }),
    body('password')
        .isLength({ min: 6 }).withMessage('password must be at least 6 characters'),    
];

exports.loginValidator = [
    body('email')
        .isEmail().withMessage('Invalid email')
        .normalizeEmail({ gmail_remove_dots: true }),
    body('password')
        .isLength({ min: 6 }).withMessage('Invalid password'),    
];
