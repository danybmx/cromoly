// Requirements
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const errors = require('../errors');
const authenticated = require('../middleware/authenticated');
const isAdmin = require('../middleware/isAdmin');

// Resource
const resource = require('../utils/resource')(User);

// Create user
const create = (req, res, next) => {
  const user = new User(req.body);
  user.role = 'USER';
  user.save()
    .then((data) => res.json({success: true}))
    .catch(next);
};

// Update user
const update = (req, res, next) => {
  User.findById(req.params.id).then((data) => {
    if (!data) return next(errors.notFound);
    if (!req.user.isAdmin) delete data.role;
    updated = Object.assign(data, req.body);
    updated.save()
      .then((data) => res.json({success: true}))
      .catch(next);
  }).catch(next);
};

// Remove user
const remove = (req, res, next) => {
  User.findById(req.params.id).then((user) => {
    if (user === null) return next(errors.notFound);
    user.remove()
      .then(() => res.json({success: true}))
      .catch(next);
  });
};

// Check if the authenticated user is the user itself or is an ADMIN/OWNER
const isUserOrAdmin = (req, res, next) => {
  if (req.user.isAdmin) return next();
  if (!allowed && req.params.id === req.user.user) return next();
  return next(errors.forbidden);
};

// Define routes
router.get('/', authenticated, isAdmin, resource.findAll);
router.get('/:id', authenticated, isAdmin, resource.findById);
router.get('/search', authenticated, isAdmin, resource.search);
router.post('/', create);
router.put('/:id', authenticated, isUserOrAdmin, update);
router.delete('/:id', authenticated, isUserOrAdmin, remove);

module.exports = router;
