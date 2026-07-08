const Review = require('../models/Review');
const Shop = require('../models/Shop');
const User = require('../models/User');

/**
 * Recalculate average rating and count of reviews for a shop, then save back to the Shop document.
 */
const recalculateShopRatings = async (shopId) => {
  const reviews = await Review.find({ shopId });
  const reviewCount = reviews.length;

  let averageRating = 0;
  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    // Round to 1 decimal place
    averageRating = Math.round((totalRating / reviewCount) * 10) / 10;
  }

  await Shop.findByIdAndUpdate(shopId, { 
    averageRating, 
    reviewCount 
  }, { new: true, runValidators: true });
};

/**
 * Creates a review or updates an existing review (upsert) for a user and shop.
 * Recalculates shop's average ratings immediately.
 * Awards platform points atomically only if it is a brand-new review document.
 */
const saveReview = async (userId, shopId, rating, text) => {
  // 1. Check if a review already exists for this user and shop
  const existingReview = await Review.findOne({ userId, shopId });
  const isNewReview = !existingReview;

  // 2. Query shop to see if reviewCount was 0 prior to this review
  const shop = await Shop.findById(shopId);
  const isFirstShopReview = isNewReview && (!shop || !shop.reviewCount || shop.reviewCount === 0);

  // 3. Use findOneAndUpdate with upsert to satisfy index constraints and avoid duplicates
  const review = await Review.findOneAndUpdate(
    { userId, shopId },
    { rating, text },
    { new: true, upsert: true, runValidators: true }
  );

  // 4. Recalculate shop average rating and total counts
  await recalculateShopRatings(shopId);

  // 5. If new review, award points atomically (15 for first shop review, 10 otherwise)
  if (isNewReview) {
    const pointsAwarded = isFirstShopReview ? 15 : 10;
    await User.findByIdAndUpdate(userId, {
      $inc: { points: pointsAwarded }
    });
  }

  return review;
};

module.exports = {
  recalculateShopRatings,
  saveReview
};
