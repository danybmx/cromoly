const HttpError = function(status, message, error) {
  return {
    type: 'HttpError',
    status: status || 500,
    message: message || 'Internal Server Error',
  };
};
HttpError.prototype = Object.create(Error.prototype);
HttpError.constructor = HttpError;

module.exports = HttpError;
