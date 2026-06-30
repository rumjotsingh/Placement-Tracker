import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {}),
  });
};

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
