const User = require('./user.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../../utils/email.utils');
const AppError = require('../../utils/AppError');
const { sendOTP } = require('../otp/otp.utils');
const QueryBuilder = require('../../utils/QueryBuilder');
const catchAsync = require('../../utils/catchAsync');
const sendResponse = require('../../utils/sendResponse');
const { StatusCodes } = require('http-status-codes');

// Get All User Data
const getAllUsers = catchAsync(async (req, res) => {
  const userQuery = new QueryBuilder(User.find(), req.query)
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

// Check User Role by Email
const getUserRole = catchAsync(async (req, res) => {
  const email = req.params.email;
  const result = await User.findOne({ email });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User role retrieved successfully',
    data: result,
  });
});

// Admin Update User Role to Admin
const updateRoleToAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await User.findByIdAndUpdate(
    id,
    { role: 'admin' },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User role updated to admin',
    data: result,
  });
});

// Admin Update User Role to User
const updateRoleToUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await User.findByIdAndUpdate(
    id,
    { role: 'user' },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User role updated to user',
    data: result,
  });
});

// Admin Delete User
const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await User.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

// Get Current User (Me)
const getMe = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Current user retrieved successfully',
    data: user,
  });
});

// Update Profile (Self)
const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { name, firstName, lastName } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;

  // If firstName and lastName are provided but name is not, update name
  if (firstName && lastName && !name) {
    updateData.name = `${firstName} ${lastName}`.trim();
  } else if ((firstName || lastName) && !name) {
    const currentUser = await User.findById(userId);
    const fname = firstName || currentUser.firstName;
    const lname = lastName || currentUser.lastName;
    updateData.name = `${fname} ${lname}`.trim();
  }

  const result = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

module.exports = {
  getAllUsers,
  getUserRole,
  updateRoleToAdmin,
  updateRoleToUser,
  deleteUser,
  getMe,
  updateProfile,
};
