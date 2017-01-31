const jwt = require('jsonwebtoken');
const HttpError = require('../errors/httpError');
const config = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const token = req.body.token
    || req.query.token
    || req.headers['x-access-token'];

  if (token) {
    // Decode the token and verifies it
    try {
      const decoded = jwt.verify(token, config.secret);
      User.findById(decoded.user.id).then((user) => {
        if (!user) return next(new HttpError(401, 'Unauthorized'));
        if (!user.hasToken(token)) {
          return next(new HttpError(401, 'Expired token'));
        }
        req.user = user;
        next();
      }).catch(next);
    } catch(err) {
      return next(new HttpError(401, 'Invalid token'));
    }
  } else {
    return next(new HttpError(401, 'Unauthorized'));
  }
};
