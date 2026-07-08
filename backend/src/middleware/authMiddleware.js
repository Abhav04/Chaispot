const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        errors: ['Authorization token required']
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        errors: ['Bearer token is empty']
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      let errMsg = 'Invalid token';
      if (err.name === 'TokenExpiredError') {
        errMsg = 'Token expired';
      }
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        errors: [errMsg]
      });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        errors: ['User account no longer exists']
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication check',
      errors: [error.message]
    });
  }
};

module.exports = requireAuth;
