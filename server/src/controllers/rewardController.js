const Shop = require('../models/Shop');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const rewardService = require('../services/rewardService');
const mongoose = require('mongoose');

/**
 * Redeems a coupon for a specific shop using reward points.
 * POST /api/rewards/redeem
 */
const redeem = async (req, res) => {
  const { shopId } = req.body;
  const userId = req.user._id;

  try {
    // 2. Verify shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
        errors: ['The specified shop does not exist.']
      });
    }

    // 3. Redeem coupon using atomic service method
    const result = await rewardService.redeemCoupon(userId, shopId);
    const { coupon, remainingPoints } = result;

    return res.status(200).json({
      success: true,
      message: 'Coupon redeemed successfully',
      coupon: {
        code: coupon.code
      },
      remainingPoints
    });
  } catch (error) {
    console.error('Coupon Redemption Error:', error);
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: 'Redemption failed',
        errors: [error.message]
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      message: 'Server error during redemption',
      errors: [error.message || 'An unexpected error occurred']
    });
  }
};

/**
 * Retrieves the authenticated user's current point balance.
 * GET /api/users/me/points
 */
const getUserPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User profile not found.']
      });
    }

    return res.status(200).json({
      success: true,
      points: user.points || 0
    });
  } catch (error) {
    console.error('Get User Points Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving point balance',
      errors: [error.message]
    });
  }
};

/**
 * Retrieves all coupons redeemed by the authenticated user, newest first.
 * GET /api/users/me/coupons
 */
const getUserCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ userId: req.user._id })
      .populate('shopId', 'name address')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.error('Get User Coupons Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving coupons history',
      errors: [error.message]
    });
  }
};

module.exports = {
  redeem,
  getUserPoints,
  getUserCoupons
};
