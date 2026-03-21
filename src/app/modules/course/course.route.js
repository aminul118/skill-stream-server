const express = require("express");
const {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  updateCourse,
} = require("./course.controller");

const router = express.Router();

router.get("/CoursesAll", getAllCourses);
router.get("/CoursesSingleDataFind/:id", getCourseById);
router.post("/CourseDataInsertDatabase", createCourse);
router.patch("/AdminUpdateCourseData/:id", updateCourse);
router.delete("/AdminDeleteCourseData/:id", deleteCourse);

module.exports = router;
