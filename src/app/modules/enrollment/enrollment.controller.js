const Enrollment = require("./enrollment.model");

// Student buy all course here
const getAllEnrollments = async (req, res) => {
  try {
    const result = await Enrollment.find();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Single course details (by CourseBuyId)
const getEnrollmentByCourseId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Enrollment.findOne({ CourseBuyId: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Student my course all
const getMyEnrollments = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await Enrollment.find({ email: email });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Student Buy Course (Send Request)
const createEnrollment = async (req, res) => {
  try {
    const enrollmentData = req.body;
    const newEnrollment = new Enrollment(enrollmentData);
    const result = await newEnrollment.save();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin approved student buy course
const approveEnrollment = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Enrollment.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true },
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin student buy course Delete
const deleteEnrollment = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Enrollment.findByIdAndDelete(id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllEnrollments,
  getEnrollmentByCourseId,
  getMyEnrollments,
  createEnrollment,
  approveEnrollment,
  deleteEnrollment,
};
