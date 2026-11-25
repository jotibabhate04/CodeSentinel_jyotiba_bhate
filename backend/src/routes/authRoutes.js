const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middleware/validateMiddleware');
const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
