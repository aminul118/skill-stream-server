const Enrollment = require('./enrollment.model');
const QueryBuilder = require('../../utils/QueryBuilder');
const { getIO } = require('../../config/socket');
const { StatusCodes } = require('http-status-codes');
const sendResponse = require('../../utils/sendResponse');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

// Student buy all course here
const getAllEnrollments = catchAsync(async (req, res) => {
  const enrollmentQuery = new QueryBuilder(
    Enrollment.find().populate('user').populate('course'),
    req.query,
  )
    .search(['transactionId', 'contactNumber', 'status'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrollmentQuery.modelQuery;
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Enrollments retrieved successfully',
    data: result,
  });
});

// Single course details
const getEnrollmentByCourseId = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Enrollment.findById(id)
    .populate('user')
    .populate('course');
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Enrollment details retrieved successfully',
    data: result,
  });
});

// Student my course all
const getMyEnrollments = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await Enrollment.find({ user: userId }).populate('course');
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My enrollments retrieved successfully',
    data: result,
  });
});

// Student Buy Course (Send Request)
const createEnrollment = catchAsync(async (req, res) => {
  if (req.user.role !== 'user') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Only students can buy courses');
  }

  const {
    courseId,
    transactionId,
    amount,
    paymentMethod,
    contactNumber,
    address,
    parentContactNumber,
    guardianName,
  } = req.body;

  // Sanitize amount: handle strings with commas (e.g., "10,000")
  const sanitizedAmount =
    typeof amount === 'string'
      ? Number(amount.replace(/[^0-9.]/g, ''))
      : Number(amount) || 0;

  const enrollmentData = {
    user: req.user.userId,
    course: courseId,
    transactionId,
    amount: sanitizedAmount,
    paymentMethod,
    contactNumber,
    address,
    parentContactNumber,
    guardianName,
  };

  const newEnrollment = new Enrollment(enrollmentData);
  const result = await newEnrollment.save();

  // Emit real-time event
  const io = getIO();
  io.to(req.user.userId.toString()).emit('enrollmentStatus', {
    status: 'pending',
    message: 'Your enrollment request has been submitted.',
    courseId,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Enrollment request submitted successfully',
    data: result,
  });
});

// Admin approved student buy course
const approveEnrollment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Enrollment.findByIdAndUpdate(
    id,
    { status: 'completed' },
    { new: true },
  ).populate('user');

  if (result) {
    // Emit real-time event to the user
    const io = getIO();
    io.to(result.user._id.toString()).emit('enrollmentStatus', {
      status: 'completed',
      message: `Congratulations! Your enrollment in the course has been approved.`,
      courseId: result.course,
    });
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Enrollment approved successfully',
    data: result,
  });
});

// Admin student buy course Delete
const deleteEnrollment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Enrollment.findByIdAndDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Enrollment deleted successfully',
    data: result,
  });
});

module.exports = {
  getAllEnrollments,
  getEnrollmentByCourseId,
  getMyEnrollments,
  createEnrollment,
  approveEnrollment,
  deleteEnrollment,
};
