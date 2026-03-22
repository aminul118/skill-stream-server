const express = require('express');
const {
  getAllEnrollments,
  getEnrollmentByCourseId,
  getMyEnrollments,
  createEnrollment,
  approveEnrollment,
  deleteEnrollment,
} = require('./enrollment.controller');

const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/StudentBuyAllCourse', auth('admin'), getAllEnrollments);
router.get('/CoursesPayDetails/:id', auth(), getEnrollmentByCourseId);
router.get('/MyAllCourse/:email', auth('user'), getMyEnrollments);
router.post('/StudentBuyCourseInformationPost', auth('user'), createEnrollment);
router.patch(
  '/AdminApprovedStudentBuyCourse/:id',
  auth('admin'),
  approveEnrollment,
);
router.delete(
  '/AdminDeleteStudentBuyCourse/:id',
  auth('admin'),
  deleteEnrollment,
);

module.exports = router;
