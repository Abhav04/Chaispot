/**
 * Centralized Global Error Handler Middleware
 * Intercepts all unhandled errors thrown inside express routing,
 * logs details, and returns consistent JSON error responses while hiding stack traces.
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled API Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Format consistent error response payload
  const errorResponse = {
    success: false,
    message: message,
    errors: [
      process.env.NODE_ENV === 'production' 
        ? 'An unexpected server error occurred.' 
        : err.message || 'Unexpected server error'
    ]
  };

  return res.status(status).json(errorResponse);
};

module.exports = errorMiddleware;
