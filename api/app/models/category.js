const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  slug: String,
  visible: Boolean,
});

module.exports = mongoose.model('Category', categorySchema);
