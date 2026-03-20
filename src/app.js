const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { StatusCodes } = require("http-status-codes");
const router = require("./app/routes");
const globalErrorHandler = require("./app/middlewares/globalErrorHandler");
const notFound = require("./app/middlewares/notFound");
const sendResponse = require("./app/utils/sendResponse");

const app = express();

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/", router);

// Test Route
app.get("/", (req, res) => {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Skill Stream Server is running smoothly.",
    data: {
      timestamp: new Date(),
      status: "Healthy"
    }
  });
});

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
