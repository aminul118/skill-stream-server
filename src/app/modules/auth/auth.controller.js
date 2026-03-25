const User = require('../user/user.model');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/AppError');
const {
  createUserTokens,
  getNewAccessToken,
} = require('../../utils/userTokens');
const { sendOTP } = require('../otp/otp.utils');
const { redisClient } = require('../../config/redis');
const catchAsync = require('../../utils/catchAsync');
const sendResponse = require('../../utils/sendResponse');
const { StatusCodes } = require('http-status-codes');

const registerUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(400, 'User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email,
    password: hashedPassword,
    isVerified: false,
    isActive: 'inactive',
  });

  await newUser.save();
  await sendOTP(newUser);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message:
      'Registration successful! Please check your email for the verification code.',
    data: { email: newUser.email },
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const redisKey = `otp:${email}`;
  const storedOTP = await redisClient.get(redisKey);

  if (!storedOTP || storedOTP !== otp) {
    throw new AppError(400, 'Invalid or expired OTP');
  }

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true, isActive: 'active', status: 'active' },
    { returnDocument: 'after' },
  ).select('-password');

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  await redisClient.del(redisKey);

  // Generate Tokens (Access & Refresh)
  const tokens = createUserTokens(user);

  // Set Cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matching refresh token)
  };

  res.cookie('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day (matching access token)
  });
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Email verified successfully!',
    data: {
      user,
      ...tokens,
    },
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, 'User with this email not found');
  }

  await sendOTP(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset OTP sent to your email.',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const redisKey = `otp:${email}`;
  const storedOTP = await redisClient.get(redisKey);

  if (!storedOTP || storedOTP !== otp) {
    throw new AppError(400, 'Invalid or expired OTP');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { returnDocument: 'after' },
  );

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  await redisClient.del(redisKey);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successful! You can now login.',
    data: null,
  });
});

const resendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  await sendOTP(user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OTP sent successfully!',
    data: null,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Verify Password first for security
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new AppError(401, 'Invalid credentials');
  }

  // Check if user is verified
  if (!user.isVerified) {
    await sendOTP(user);
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message:
        'Email not verified. A new verification code has been sent to your email.',
      needsVerification: true,
      data: { email: user.email },
    });
  }

  // Check if user is active
  if (user.isActive !== 'active') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      `Your account is ${user.isActive}. Please contact support.`,
    );
  }

  // Generate Tokens (Access & Refresh)
  const { accessToken, refreshToken } = createUserTokens(user);

  // Set Cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login Successfully',
    data: {
      user: userResponse,
      accessToken,
      refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: tokenFromContext } = req.body;
  const tokenFromCookie = req.cookies.refreshToken;

  const token = tokenFromCookie || tokenFromContext;

  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token is required');
  }

  const result = await getNewAccessToken(token);

  // Update access token cookie
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token retrieved successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: user,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const isMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid current password');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password changed successfully',
    data: null,
  });
});

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  refreshToken,
  forgotPassword,
  resetPassword,
  resendOTP,
  getMe,
  logoutUser,
  changePassword,
};
