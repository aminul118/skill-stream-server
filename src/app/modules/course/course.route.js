const express = require("express");
const {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
} = require("./course.controller");

const router = express.Router();

router.get("/CoursesAll", getAllCourses);
router.get("/CoursesSingleDataFind/:id", getCourseById);
router.post("/CourseDataInsertDatabase", createCourse);
router.delete("/AdminDeleteCourseData/:id", deleteCourse);

module.exports = router;
