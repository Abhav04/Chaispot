const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { generateCouponCode } = require('../utils/couponGenerator');

/**
 * Redeems a coupon atomically, decrementing points and generating a unique code.
 * Ensures points can never drop below 0.
 */
const redeemCoupon = async (userId, shopId) => {
  // 1. Perform atomic points decrement check (prevents double redemption & race conditions)
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, points: { $gte: 50 } },
    { $inc: { points: -50 } },
    { new: true }
  );

  // If no user was matched/updated, they did not have enough points
  if (!updatedUser) {
    const err = new Error('Insufficient points. Need at least 50 points to redeem a coupon.');
    err.statusCode = 400;
    throw err;
  }

  let coupon;
  let saved = false;
  let attempts = 0;

  // 2. Save coupon with code generation collision checks (up to 5 attempts)
  while (!saved && attempts < 5) {
    attempts++;
    const code = generateCouponCode();

    try {
      coupon = new Coupon({
        userId,
        shopId,
        code,
        pointsSpent: 50
      });
      await coupon.save();
      saved = true;
    } catch (dbErr) {
      // Catch MongoDB duplicate key error (code 11000) for unique index 'code'
      if (dbErr.code === 11000) {
        console.warn(`Coupon collision detected for code on attempt ${attempts}. Retrying...`);
      } else {
        // Rollback points decrement on other unexpected database errors
        await User.findByIdAndUpdate(userId, { $inc: { points: 50 } });
        throw dbErr;
      }
    }
  }

  // 3. Rollback if code generation attempts failed
  if (!saved) {
    await User.findByIdAndUpdate(userId, { $inc: { points: 50 } });
    const retryErr = new Error('Failed to generate a unique coupon code. Point balance refunded.');
    retryErr.statusCode = 500;
    throw retryErr;
  }

  return {
    coupon,
    remainingPoints: updatedUser.points
  };
};

module.exports = {
  redeemCoupon
};
