const express = require('express');
const router = express.Router();
const { redeem, getUserPoints, getUserCoupons } = require('../controllers/rewardController');
const requireAuth = require('../middleware/authMiddleware');
const { redeemValidation } = require('../validators/rewardValidator');

// POST /api/rewards/redeem - Redeem points for a coupon (Protected)
router.post('/rewards/redeem', requireAuth, redeemValidation, redeem);

// GET /api/users/me/points - Retrieve point balance (Protected)
router.get('/users/me/points', requireAuth, getUserPoints);

// GET /api/users/me/coupons - Retrieve coupon history (Protected)
router.get('/users/me/coupons', requireAuth, getUserCoupons);

module.exports = router;
