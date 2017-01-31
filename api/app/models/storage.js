const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storageSchema = new Schema({
  name: String,
  phone: String,
  useAsPrimary: Boolean,
  address: {
    address: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
});

module.exports = mongoose.model('Storage', storageSchema);
