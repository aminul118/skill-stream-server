const crypto = require('crypto');
const { redisClient } = require('../../config/redis');
const sendEmail = require('../../utils/email.utils');

const OTP_EXPIRATION = 2 * 60; // 2 minutes

const generateOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (user) => {
  const otp = generateOTP();
  const redisKey = `otp:${user.email}`;

  // Store OTP in Redis with expiration
  await redisClient.set(redisKey, otp, {
    EX: OTP_EXPIRATION,
  });

  // Send OTP via Email
  await sendEmail({
    to: user.email,
    subject: 'Skill-Stream Verification Code',
    templateName: 'otp',
    templateData: {
      name: `${user.firstName} ${user.lastName}`,
      otp: otp,
    },
  });
};

module.exports = {
  sendOTP,
};
