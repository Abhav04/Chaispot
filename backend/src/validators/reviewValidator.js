const { body, validationResult } = require('express-validator');

const reviewValidation = [
  body('rating')
    .exists().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('text')
    .trim()
    .notEmpty().withMessage('Review text is required')
    .isLength({ max: 500 }).withMessage('Review text cannot exceed 500 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

module.exports = {
  reviewValidation
};
