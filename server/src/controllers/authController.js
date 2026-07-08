const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const signup = async (req, res) => {
  // 1. Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => err.msg)
    });
  }

  const { email, password } = req.body;

  try {
    // 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    
    // 3. Return 409 if duplicate
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate email',
        errors: ['An account with this email address already exists']
      });
    }

    // 4. Create and Save user (hashing handled by pre-save hook)
    const user = new User({ email, password });
    await user.save();

    // 6. Generate JWT
    const token = generateToken(user);

    // 7. Return payload (password is automatically deleted via userSchema toJSON)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });

  } catch (error) {
    console.error('Signup Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
      errors: ['A server error occurred during registration. Please try again.']
    });
  }
};

const login = async (req, res) => {
  // 1. Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => err.msg)
    });
  }

  const { email, password } = req.body;

  try {
    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      // 4. Return 401 for invalid credentials
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password']
      });
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // 4. Return 401 for invalid credentials
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password']
      });
    }

    // 5. Generate JWT
    const token = generateToken(user);

    // 6. Return payload
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user
    });

  } catch (error) {
    console.error('Login Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      errors: ['A server error occurred during login. Please try again.']
    });
  }
};

module.exports = {
  signup,
  login
};
