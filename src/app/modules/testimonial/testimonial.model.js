const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model(
  'Testimonial',
  testimonialSchema,
  'Testimonial',
);
