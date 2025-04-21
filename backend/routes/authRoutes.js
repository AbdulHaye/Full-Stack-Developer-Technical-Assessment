const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // protect middleware is only for routes that need auth

// Register route (No authentication required)
router.post('/register', registerUser); 

// Login route (No authentication required)
router.post('/login', loginUser);

// Profile route (Requires authentication)
router.get('/me', protect, getMe); // This route requires authentication

module.exports = router;
