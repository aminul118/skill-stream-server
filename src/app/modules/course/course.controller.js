const Course = require("./course.model");

// Get All Courses Data
const getAllCourses = async (req, res) => {
  try {
    const result = await Course.find();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get Single Course Data
const getCourseById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Course.findById(id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create Course
const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newCourse = new Course(courseData);
    const result = await newCourse.save();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin Course Data Delete
const deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Course.findByIdAndDelete(id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
};
