const User = require("./user.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../../utils/email.utils");
const AppError = require("../../utils/AppError");
const { sendOTP } = require("../otp/otp.utils");

// Get All User Data
const getAllUsers = async (req, res, next) => {
  try {
    const result = await User.find();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};



// Check User Role by Email
const getUserRole = async (req, res, next) => {
  try {
    const email = req.params.email;
    const result = await User.findOne({ email });
    if (!result) {
      throw new AppError(404, "User not found");
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Update User Role to Admin
const updateRoleToAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await User.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true },
    );
    if (!result) {
      throw new AppError(404, "User not found");
    }
    res.status(200).json({
      success: true,
      message: "User role updated to admin",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Update User Role to User
const updateRoleToUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await User.findByIdAndUpdate(
      id,
      { role: "user" },
      { new: true },
    );
    if (!result) {
      throw new AppError(404, "User not found");
    }
    res.status(200).json({
      success: true,
      message: "User role updated to user",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Delete User
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      throw new AppError(404, "User not found");
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User (Me)
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
  getAllUsers,
  getUserRole,
  updateRoleToAdmin,
  updateRoleToUser,
  deleteUser,
  getMe,
};
