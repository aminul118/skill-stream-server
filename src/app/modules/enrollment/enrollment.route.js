const express = require('express');
const {
  getAllEnrollments,
  getEnrollmentByCourseId,
  getMyEnrollments,
  createEnrollment,
  approveEnrollment,
  deleteEnrollment,
} = require('./enrollment.controller');

const router = express.Router();

router.get('/StudentBuyAllCourse', getAllEnrollments);
router.get('/CoursesPayDetails/:id', getEnrollmentByCourseId);
router.get('/MyAllCourse/:email', getMyEnrollments);
router.post('/StudentBuyCourseInformationPost', createEnrollment);
router.patch('/AdminApprovedStudentBuyCourse/:id', approveEnrollment);
router.delete('/AdminDeleteStudentBuyCourse/:id', deleteEnrollment);

module.exports = router;
