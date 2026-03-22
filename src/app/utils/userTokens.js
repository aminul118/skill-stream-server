const { generateToken, verifyToken } = require('./jwt');
const AppError = require('./AppError');
const User = require('../modules/user/user.model');
const env = require('../config/env');

const createUserTokens = (user) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.ACCESS_TOKEN_SECRET,
    env.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getNewAccessToken = async (refreshToken) => {
  try {
    const verifiedToken = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ email: verifiedToken.email });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.isActive !== 'active') {
      throw new AppError(403, 'User is not active');
    }

    const jwtPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(
      jwtPayload,
      env.ACCESS_TOKEN_SECRET,
      env.JWT_ACCESS_EXPIRES,
    );

    return { accessToken };
  } catch (error) {
    throw new AppError(401, 'Invalid refresh token');
  }
};

module.exports = {
  createUserTokens,
  getNewAccessToken,
};
