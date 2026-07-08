const express = require('express');
const router = express.Router();
const { postReview, getShopReviews, getMyReviews } = require('../controllers/reviewController');
const requireAuth = require('../middleware/authMiddleware');
const { reviewValidation } = require('../validators/reviewValidator');

// POST /api/shops/:shopId/reviews - Post review (Protected)
router.post('/shops/:shopId/reviews', requireAuth, reviewValidation, postReview);

// GET /api/shops/:shopId/reviews - Get reviews for a shop (Public)
router.get('/shops/:shopId/reviews', getShopReviews);

// GET /api/reviews/me - Get reviews by current user (Protected)
router.get('/reviews/me', requireAuth, getMyReviews);

module.exports = router;
