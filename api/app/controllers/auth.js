// Requirements
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
const config = require('../config');
const errors = require('../errors');

// Login method
const login = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  }).select('+password +salt').exec((err, user) => {
    if (err) return next(errors.internalServerError);

    if (!user) {
      return next(errors.notFound);
    }

    if (!user.authenticate(req.body.password)) {
      return next(errors.unauthorized);
    }

    const token = jwt.sign({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    }, config.secret, {
      expiresIn: '1 year',
    });

    user.tokens.push({
      token: token,
      ip: requestIp.getClientIp(req),
      createdAt: new Date(),
    });
    user.save().then(() => {
      return res.json({
        success: true,
        token: token,
      });
    });
  });
};

const validate = (req, res, next) => {
  const token = req.body.token;
  try {
    const data = jwt.decode(token);
    if (data.user && data.user.id) {
      return User.findById(data.user.id).then((user) => {
        if (user.hasToken(token)) {
          res.json({
            success: true,
          });
        } else {
          return next(errors.unauthorized);
        }
      }).catch((err) => {
        return next(errors.unauthorized);
      });
    }
    return next(errors.unauthorized);
  } catch (err) {
    return next(errors.unauthorized);
  }
};

// Define routes
router.post('/login', login);
router.post('/validate', validate);

module.exports = router;
