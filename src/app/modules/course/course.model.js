const mongoose = require('mongoose');

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
      type: mongoose.Schema.Types.Mixed,
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
    // Adding typo versions for compatibility with existing database records
    Course_GideLine_One: { type: String },
    Course_GideLine_Two: { type: String },
    Course_GideLine_Three: { type: String },
    Course_GideLine_Four: { type: String },
    Course_GideLine_Five: { type: String },
    Course_GideLine_Six: { type: String },
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

module.exports = mongoose.model('Course', courseSchema, 'AllCourse');
