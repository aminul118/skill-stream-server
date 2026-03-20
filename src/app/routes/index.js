const express = require("express");
const userRoutes = require("../modules/user/user.route");
const courseRoutes = require("../modules/course/course.route");
const enrollmentRoutes = require("../modules/enrollment/enrollment.route");
const testimonialRoutes = require("../modules/testimonial/testimonial.route");
const authRoutes = require("../modules/auth/auth.route");
const contactRoutes = require("../modules/contact/contact.route");

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/courses",
    route: courseRoutes,
  },
  {
    path: "/enrollments",
    route: enrollmentRoutes,
  },
  {
    path: "/testimonials",
    route: testimonialRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
