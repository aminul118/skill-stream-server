const User = require("../user/user.model");
const bcrypt = require("bcryptjs");
const AppError = require("../../utils/AppError");
const {
  createUserTokens,
  getNewAccessToken,
} = require("../../utils/userTokens");
const { sendOTP } = require("../otp/otp.utils");
const { redisClient } = require("../../config/redis");

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, "User with this email already exists");
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
      isActive: "inactive",
    });

    await newUser.save();
    await sendOTP(newUser);

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for the verification code.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const redisKey = `otp:${email}`;
    const storedOTP = await redisClient.get(redisKey);

    if (!storedOTP || storedOTP !== otp) {
      throw new AppError(400, "Invalid or expired OTP");
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true, isActive: "active", status: "active" },
      { new: true },
    ).select("-password");

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await redisClient.del(redisKey);

    // Generate Tokens (Access & Refresh)
    const tokens = createUserTokens(user);

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      data: {
        user,
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(404, "User with this email not found");
    }

    await sendOTP(user);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const redisKey = `otp:${email}`;
    const storedOTP = await redisClient.get(redisKey);

    if (!storedOTP || storedOTP !== otp) {
      throw new AppError(400, "Invalid or expired OTP");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true },
    );

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await redisClient.del(redisKey);

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now login.",
    });
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    await sendOTP(user);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Verify Password first for security
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new AppError(401, "Invalid credentials");
    }

    // Check if user is verified
    if (!user.isVerified) {
      await sendOTP(user);
      return res.status(403).json({
        success: false,
        message:
          "Email not verified. A new verification code has been sent to your email.",
        needsVerification: true,
        data: { email: user.email },
      });
    }

    // Check if user is active
    if (user.isActive !== "active") {
      throw new AppError(
        403,
        `Your account is ${user.isActive}. Please contact support.`,
      );
    }

    // Generate Tokens (Access & Refresh)
    const { accessToken, refreshToken } = createUserTokens(user);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      throw new AppError(401, "Refresh token is required");
    }

    const result = await getNewAccessToken(token);

    res.status(200).json({
      success: true,
      message: "Access token retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError(404, "User not found");
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  refreshToken,
  forgotPassword,
  resetPassword,
  resendOTP,
  getMe,
};
