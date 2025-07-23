// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  // Default error
  const error = {
    success: false,
    message: err.message || "Internal server error",
    status: err.status || 500,
  }

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    error.message = err.errors.map((e) => e.message).join(", ")
    error.status = 400
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    error.message = "Resource already exists"
    error.status = 409
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token"
    error.status = 401
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired"
    error.status = 401
  }

  // Send error response
  res.status(error.status).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = { errorHandler }
