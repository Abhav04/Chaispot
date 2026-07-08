const express = require('express');
const router = express.Router();
const { createShop, getAllShops, getShopById, geocodeAddressEndpoint } = require('../controllers/shopController');
const requireAuth = require('../middleware/authMiddleware');
const { createShopValidation } = require('../validators/shopValidator');

// POST /api/shops - Create a shop (Protected)
router.post('/', requireAuth, createShopValidation, createShop);

// GET /api/shops - Get all shops (Public)
router.get('/', getAllShops);

// GET /api/shops/geocode - Geocode start location (Public)
router.get('/geocode', geocodeAddressEndpoint);

// GET /api/shops/:id - Get shop by ID (Public)
router.get('/:id', getShopById);

module.exports = router;
