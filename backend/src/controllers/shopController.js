const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const { geocodeAddress } = require('../services/locationService');

// Create new shop
const createShop = async (req, res) => {
  // 1. Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg)
    });
  }

  const { name, address, description, photoUrl } = req.body;

  try {
    // 2. Call Nominatim geocoding service
    const geocodeResult = await geocodeAddress(address);
    const { latitude, longitude } = geocodeResult;

    // 3. Create shop record
    const shop = new Shop({
      name,
      address,
      description,
      photoUrl,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude] // GeoJSON format requires [longitude, latitude]
      },
      createdBy: req.user._id,
      averageRating: 0,
      reviewCount: 0
    });

    // 4. Save to MongoDB Atlas
    await shop.save();

    return res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });

  } catch (error) {
    console.error('Create Shop Controller Error:', error);
    
    // Check if error is geocoding failure (Address not found)
    if (error.message === 'Address could not be located.') {
      return res.status(400).json({
        success: false,
        message: 'Geocoding failed',
        errors: ['Address could not be located.']
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error during shop registration',
      errors: [error.message || 'An unexpected error occurred']
    });
  }
};

// Retrieve all shops (newest first)
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email'); // Option to inspect creator's email

    return res.status(200).json({
      success: true,
      data: shops
    });
  } catch (error) {
    console.error('Get All Shops Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving shops list',
      errors: [error.message]
    });
  }
};

// Retrieve single shop by ID
const getShopById = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId structure before running DB query to avoid Mongoose CastErrors
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: 'Shop not found',
      errors: ['Invalid shop ID format']
    });
  }

  try {
    const shop = await Shop.findById(id).populate('createdBy', 'email');
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
        errors: ['No shop found with that ID']
      });
    }

    return res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    console.error('Get Shop By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving shop details',
      errors: [error.message]
    });
  }
};

// Geocode address query (for manual starting locations)
const geocodeAddressEndpoint = async (req, res) => {
  const { address } = req.query;
  if (!address || address.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['Address parameter is required']
    });
  }

  try {
    const geocodeResult = await geocodeAddress(address);
    return res.status(200).json({
      success: true,
      data: geocodeResult
    });
  } catch (error) {
    console.error('Geocode Address Endpoint Error:', error);
    if (error.message === 'Address could not be located.') {
      return res.status(400).json({
        success: false,
        message: 'Geocoding failed',
        errors: ['Address could not be located.']
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      message: 'Server error during geocoding',
      errors: [error.message || 'An unexpected error occurred']
    });
  }
};

module.exports = {
  createShop,
  getAllShops,
  getShopById,
  geocodeAddressEndpoint
};
