const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: String,
  slug: String,
  visible: Boolean,
});

module.exports = mongoose.model('Brand', brandSchema);
