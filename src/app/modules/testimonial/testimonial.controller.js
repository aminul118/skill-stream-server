const Testimonial = require('./testimonial.model');
const QueryBuilder = require('../../utils/QueryBuilder');

// Get All Testimonial Data
const getAllTestimonials = async (req, res) => {
  try {
    const testimonialQuery = new QueryBuilder(Testimonial.find(), req.query)
      .search(['name', 'details'])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await testimonialQuery.modelQuery;
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create Testimonial
const createTestimonial = async (req, res) => {
  try {
    const testimonialData = req.body;
    const newTestimonial = new Testimonial(testimonialData);
    const result = await newTestimonial.save();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin testimonial data update to approved
const approveTestimonial = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Testimonial.findByIdAndUpdate(
      id,
      { status: 'Approved' },
      { new: true },
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin Testimonial Data Delete
const deleteTestimonial = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Testimonial.findByIdAndDelete(id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  approveTestimonial,
  deleteTestimonial,
};
