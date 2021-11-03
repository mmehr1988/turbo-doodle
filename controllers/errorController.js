const AppError = require('../utils/appError');

// ------------------------------------------------------------
// ERROR Handling for mongodb specific
// ------------------------------------------------------------

// GET REQUESTS: Mongoose incorrect paths
const handleCastErrorDB = (err) => {
  // Path is the input field
  // Value is the input
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// POST REQUESTS: Models with UNIQUE field - Error handling for Mongoose unique fields as these would not be captured otherwise with the current error handling setup between NODE_ENV = Production vs. NODE_ENV = Development
const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: [${value}]. Please use another value`;
  return new AppError(message, 400);
};

// PATCH REQUESTS: Models with VALIDATION fields
const handleValidationErrorDB = (err) => {
  // In our Model we have many fields with validations. As a result, when an error gets generated, it will be an Array of Objects. To capture all the messages for each validation error, we have to loop over each Object. To do this, we use Object.values(err.errors).map((el) => el.message)
  const errors = Object.values(err.errors).map((el) => el.message);

  // Then join each error message so the output error message becomes one cohesive message.
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// ------------------------------------------------------------

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to user
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // [1] Log error
    console.error('ERROR 💥', err);

    // [2] Send generic Message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };

    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};
