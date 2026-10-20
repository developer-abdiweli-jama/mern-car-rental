const AppError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
};

const handleCastErrorDB = (err) => AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue ? err.keyValue[field] : '';
  return AppError(`Duplicate value '${value}' for field '${field}'. Please use another value.`, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors || {}).map((e) => e.message);
  return AppError(`Invalid input: ${errors.join('. ')}`, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
    stack: err.stack,
    errorDetails: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
  // programming errors - don't leak details
  return res.status(500).json({ success: false, error: 'Internal server error' });
};

const errorHandler = (err, req, res, next) => {
  // Express requires four parameters to identify this as error middleware.
  void next;
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = AppError('Invalid token. Please log in again.', 401);
    if (error.name === 'TokenExpiredError') error = AppError('Token expired. Please log in again.', 401);
    sendErrorProd(error, res);
  }
};

export { AppError, errorHandler };
