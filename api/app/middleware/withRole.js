const HttpError = require('../errors/httpError');

module.exports = (roles) => {
  return (req, res, next) => {
    if (roles.indexOf(req.user.role) < 0) {
      return next(new HttpError(403, 'Forbidden'));
    }
    next();
  };
};
