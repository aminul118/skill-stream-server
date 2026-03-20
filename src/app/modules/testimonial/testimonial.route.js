const express = require("express");
const {
  getAllTestimonials,
  createTestimonial,
  approveTestimonial,
  deleteTestimonial,
} = require("./testimonial.controller");

const router = express.Router();

router.get("/TestimonialAll", getAllTestimonials);
router.post("/TestimonialDataInsertDatabase", createTestimonial);
router.patch("/AdminApprovedTestimonialData/:id", approveTestimonial);
router.delete("/AdminDeleteTestimonialData/:id", deleteTestimonial);

module.exports = router;
