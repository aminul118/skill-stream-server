const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    Course_Name: {
      type: String,
      required: true,
    },
    Course_Title: {
      type: String,
      required: true,
    },
    Course_Price: {
      type: Number,
      required: true,
    },
    Course_Start: {
      type: String,
    },
    Course_Guideline_One: {
      type: String,
    },
    Course_Guideline_Two: {
      type: String,
    },
    Course_Guideline_Three: {
      type: String,
    },
    Course_Guideline_Four: {
      type: String,
    },
    Course_Guideline_Five: {
      type: String,
    },
    Course_Guideline_Six: {
      type: String,
    },
    image: {
      type: String,
    },
    Instructors: [
      {
        type: Object,
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Course", courseSchema, "AllCourse");
