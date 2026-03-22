const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Bkash', 'Rocket', 'MasterCard', 'Visa'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    contactNumber: String,
    parentContactNumber: String,
    guardianName: String,
    address: String,
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model('Enrollment', enrollmentSchema, 'enrollments');
