import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Log error with Winston
  logger.error(err);

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value entered";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;