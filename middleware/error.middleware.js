const errorMiddleware = (err, req, res, next) => {
  // Don't wrap in try/catch — if this fails, let Node handle it
  let error = { ...err };
  error.message = err.message;

  console.error("🚨 Global error caught:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new Error("Resource not found");
    error.statusCode = 404;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    error = new Error("Duplicate field value entered");
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new Error(message);
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    error = new Error("Invalid or expired token");
    error.statusCode = 401;
  }

  // Send final response — NO next() call after this!
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      name: err.name,
    }),
  });

  // ✅ DO NOT call next() — this is the final error handler
};

export default errorMiddleware;
