const { StatusCodes } = require('http-status-codes');

const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    route: req.path,
    message: 'Route Not found',
  });
};

module.exports = notFound;
