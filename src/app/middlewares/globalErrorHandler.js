const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: err.message || "Something went wrong!",
    },
  ];

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errorSources = Object.values(err.errors).map((val) => ({
      path: val.path,
      message: val.message,
    }));
  }

  // Handle Mongoose Cast Error (Invalid ID)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
    errorSources = [
      {
        path: err.path,
        message: err.message,
      },
    ];
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate Key Error";
    const field = Object.keys(err.keyValue)[0];
    errorSources = [
      {
        path: field,
        message: `${field} already exists`,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = globalErrorHandler;
