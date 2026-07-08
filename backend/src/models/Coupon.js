const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'Shop ID is required']
  },
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  pointsSpent: {
    type: Number,
    required: true,
    default: 50
  },
  redeemedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'USED', 'EXPIRED'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
