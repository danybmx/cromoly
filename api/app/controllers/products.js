// Requirements
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const authenticated = require('../middleware/authenticated');
const isAdmin = require('../middleware/isAdmin');

// Resource
const resource = require('../utils/resource')(Product);

// Define routes
router.get('/', resource.findAll);
router.get('/:id', resource.findById);
router.get('/search', resource.search);
router.post('/', authenticated, isAdmin, resource.create);
router.put('/:id', authenticated, isAdmin, resource.update);
router.delete('/:id', authenticated, isAdmin, resource.remove);

module.exports = router;
