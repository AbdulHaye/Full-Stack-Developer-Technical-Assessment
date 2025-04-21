const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // keep protect for routes that need auth

router.post('/register', registerUser); // No protection middleware here
router.post('/login', loginUser);
router.get('/me', protect, getMe); // This route requires authentication

module.exports = router;
