const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    minlength: [3, 'Shop name must be at least 3 characters long']
  },
  address: {
    type: String,
    required: [true, 'Shop address is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Shop description is required']
  },
  photoUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        // Simple URL validation regex
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v);
      },
      message: 'Please provide a valid photo URL'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator User ID is required']
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index shop locations for spatial queries (like nearby queries in future phases)
shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);
