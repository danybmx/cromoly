const HttpError = require('./httpError');

module.exports = {
  HttpError: HttpError,
  // Common HTTP Errors
  forbidden: new HttpError(403, 'Forbidden'),
  unauthorized: new HttpError(401, 'Unauthorized'),
  notFound: new HttpError(404, 'Not Found'),
  internalServerError: new HttpError(500, 'Internal Server Error'),
};
