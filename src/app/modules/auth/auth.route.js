const express = require('express');
const {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  refreshToken,
  getMe,
  logoutUser,
  changePassword,
} = require('./auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/me', auth(), getMe);
router.patch('/change-password', auth(), changePassword);

module.exports = router;
