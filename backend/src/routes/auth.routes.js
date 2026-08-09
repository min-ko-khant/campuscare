const express = require('express');

const router = express.Router();

const {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/auth.middleware');

const roleMiddleware = require('../middleware/role.middleware');

// ==========================
// AUTH ROUTES
// ==========================

router.post('/register', register);

router.post('/verify-otp', verifyOTP);

router.post('/login', login);

router.post('/refresh-token', refreshToken);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/resend-otp', resendOTP);

// ==========================
// TEST PROTECTED ROUTES
// ==========================

router.get(
  '/student-only',
  authMiddleware,
  roleMiddleware('student'),

  (req, res) => {
    res.json({
      success: true,

      message: 'Student access granted',
    });
  }
);

router.get(
  '/profile',

  authMiddleware,

  (req, res) => {
    res.json({
      success: true,

      message: 'Protected route access',

      user: req.user,
    });
  }
);

module.exports = router;
