const { redisClient } = require('../../config/redis');
const AppError = require('../../utils/AppError');
const User = require('../user/user.model');
const { createUserTokens } = require('../../utils/userTokens');

const verifyOTP = async (email, otp) => {
    const user = await User.findOne({ email }).select('-password');

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    if (user.isVerified) {
        throw new AppError(400, 'User is already verified');
    }

    const redisKey = `otp:${email}`;
    const savedOtp = await redisClient.get(redisKey);

    if (!savedOtp || savedOtp !== otp) {
        throw new AppError(400, 'Invalid or expired OTP');
    }

    // Mark user as verified
    user.isVerified = true;
    user.isActive = "active";
    user.status = "active";
    await user.save();

    // Delete OTP from Redis
    await redisClient.del(redisKey);

    // Generate Tokens
    const tokens = createUserTokens(user);

    return {
        user,
        ...tokens
    };
};

module.exports = {
    verifyOTP
};
