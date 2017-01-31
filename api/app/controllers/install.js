// Requirements
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Define routes
router.post('/', (req, res, next) => {
  const promises = [];

  if (req.body.owner) {
    const createOwnerPromise = new Promise((resolve, reject) => {
      new Promise((resolve, reject) => {
        User.findOne({role: 'OWNER'}).exec().then((user) => {
          if (!user) return resolve();
          reject('Owner user already exists');
        }).catch((err) => {
          reject(err);
        });
      }).then(() => {
        const userData = Object.assign({
          email: 'owner@example.com',
          role: 'OWNER',
        }, req.body.owner);
        // Create owner user
        const user = new User(userData);
        user.save().then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });

    promises.push(createOwnerPromise);
  }

  Promise.all(promises).then((data) => {
    res.json({
      success: true,
    });
  }).catch((err) => {
    res.json({
      success: false,
      error: err,
    });
  });
});

module.exports = router;
