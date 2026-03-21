const Course = require("./course.model");
const QueryBuilder = require("../../utils/QueryBuilder");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const { StatusCodes } = require("http-status-codes");

// Get All Courses Data
const getAllCourses = catchAsync(async (req, res) => {
  const courseQuery = new QueryBuilder(Course.find(), req.query)
    .search(["Course_Name", "Course_Title"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Courses retrieved successfully",
    meta,
    data: result,
  });
});

// Get Single Course Data
const getCourseById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Course.findById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});

// Create Course
const createCourse = catchAsync(async (req, res) => {
  const courseData = req.body;
  const newCourse = new Course(courseData);
  const result = await newCourse.save();

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

// Admin Course Data Delete
const deleteCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Course.findByIdAndDelete(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
};
