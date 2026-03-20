const express = require('express');
const { verifyOTPController } = require('./otp.controller');

const router = express.Router();

router.post('/verify-otp', verifyOTPController);

module.exports = router;
