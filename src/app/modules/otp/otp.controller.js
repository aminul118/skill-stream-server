const { verifyOTP } = require('./otp.service');

const verifyOTPController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP Verified Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyOTPController,
};
