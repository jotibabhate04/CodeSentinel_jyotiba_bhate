const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or malformed authorization header.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'codesentinel_default_secret_key_change_in_production';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or forged token.'
      });
    }

    // Check if user still exists
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    // Attach user to request object (excluding password)
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticateToken;
