const { body } = require('express-validator');

const createShopValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Shop name is required')
    .isLength({ min: 3 }).withMessage('Shop name must be at least 3 characters long'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('photoUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL().withMessage('Photo URL must be a valid URL address')
];

module.exports = {
  createShopValidation
};
