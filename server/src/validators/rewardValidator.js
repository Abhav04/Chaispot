const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const redeemValidation = [
  body('shopId')
    .notEmpty().withMessage('Shop ID is required to redeem a coupon')
    .custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid shop ID format'),
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
  redeemValidation
};
