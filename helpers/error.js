class ErrorHandler extends Error {
  constructor(statusCode, errors, message ) {
    super();
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message.toString();
  }
}

const handleError = (err, req, res, next) => {
  
  if (res.headersSent) {
    return next(err)
  }
  
  if (err.errors && err.errors.name === 'MongoError' && err.errors.code === 11000) {
    err.message = 'There was a duplicate key error'
  }

  const { statusCode, errors, message } = err;
  res.status(statusCode).json({
    statusCode,
    errors,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
}