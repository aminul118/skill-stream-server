const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    CourseBuyId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    // Adding other potential fields based on usage
    courseName: String,
    price: Number,
    transactionId: String,
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema,
  "StudentBuyCourse",
);
