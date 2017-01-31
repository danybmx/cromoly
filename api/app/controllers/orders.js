// Requirements
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const authenticated = require('../middleware/authenticated');
const isAdmin = require('../middleware/isAdmin');

// Resource
const resource = require('../utils/resource')(Order);

// Define routes
router.get('/types', (req, res, next) => {
  res.json(['BUDGET', 'ORDER', 'INVOICE']);
});
router.get('/', authenticated, isAdmin, resource.findAll);
router.get('/:id', authenticated, isAdmin, resource.findById);
router.get('/search', authenticated, isAdmin, resource.search);
router.post('/', authenticated, isAdmin, resource.create);
router.put('/:id', authenticated, isAdmin, resource.update);
router.delete('/:id', authenticated, isAdmin, resource.remove);

module.exports = router;
