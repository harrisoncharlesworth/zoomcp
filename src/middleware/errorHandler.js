/**
 * Error handling middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message, err.stack);
  
  // Check if headers are already sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Set status code (default to 500 if not set)
  const statusCode = err.statusCode || 500;
  
  // Return error response
  res.status(statusCode).json({
    error: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = { errorHandler };