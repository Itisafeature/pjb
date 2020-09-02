const AppError = require('../utils/appError');

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = err => {
  const value = Object.keys(err.keyValue)[0];
  const message = `${value} is already taken. Please use another!`;
  return new AppError(message, 400);
};

const sendError = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error to console
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  console.log(err);
  if (err.name === 'ValidationError') {
    error = handleValidationError(error);
  } else if (err.code === 11000) {
    error = handleDuplicateFields(error);
  }

  sendError(error, req, res);
};
