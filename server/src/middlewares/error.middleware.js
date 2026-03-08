const ApiError = require('../utils/ApiError');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, 'Not found'));
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
