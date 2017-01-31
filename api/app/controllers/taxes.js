// Requirements
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Tax = mongoose.model('Tax');
const authenticated = require('../middleware/authenticated');
const isAdmin = require('../middleware/isAdmin');

// Resource
const resource = require('../utils/resource')(Tax);

// Define routes
router.get('/', authenticated, resource.findAll);
router.get('/:id', authenticated, resource.findById);
router.get('/search', authenticated, resource.search);
router.post('/', authenticated, isAdmin, resource.create);
router.put('/:id', authenticated, isAdmin, resource.update);
router.delete('/:id', authenticated, isAdmin, resource.remove);

module.exports = router;
