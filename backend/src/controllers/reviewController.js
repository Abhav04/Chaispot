const Shop = require('../models/Shop');
const Review = require('../models/Review');
const reviewService = require('../services/reviewService');
const mongoose = require('mongoose');

/**
 * Creates a review or updates it if one already exists for the current user and shop.
 * POST /api/shops/:shopId/reviews
 */
const postReview = async (req, res) => {
  const { shopId } = req.params;
  const { rating, text } = req.body;
  const userId = req.user._id;

  // 1. Verify valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid shop ID format',
      errors: ['The provided shop ID format is invalid.']
    });
  }

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

    // 3. Save review (creates new or updates existing) and recalculate ratings
    const review = await reviewService.saveReview(userId, shopId, rating, text);

    return res.status(200).json({
      success: true,
      message: 'Review saved successfully',
      data: review
    });
  } catch (error) {
    console.error('Post Review Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error saving review',
      errors: [error.message]
    });
  }
};

/**
 * Retrieves all reviews for a shop, newest first, populating user email.
 * GET /api/shops/:shopId/reviews
 */
const getShopReviews = async (req, res) => {
  const { shopId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid shop ID format',
      errors: ['The provided shop ID format is invalid.']
    });
  }

  try {
    const reviews = await Review.find({ shopId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get Shop Reviews Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving reviews',
      errors: [error.message]
    });
  }
};

/**
 * Retrieves all reviews submitted by the authenticated user.
 * GET /api/reviews/me
 */
const getMyReviews = async (req, res) => {
  const userId = req.user._id;

  try {
    const reviews = await Review.find({ userId })
      .populate('shopId', 'name address')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get My Reviews Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving your reviews',
      errors: [error.message]
    });
  }
};

module.exports = {
  postReview,
  getShopReviews,
  getMyReviews
};
