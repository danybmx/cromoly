const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxSchema = new Schema({
  name: String,
  value: Number,
  default: Boolean,
});

module.exports = mongoose.model('Tax', taxSchema);
