const express = require('express');
const { authMiddleware, adminAuth } = require('../middleware/auth');
const { register, login, forgotPassword, resetPassword, refreshToken, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, adminAuth, logout);

module.exports = router;