const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const warehouseSchema = new Schema({
  name: String,
  phone: String,
  useForWeb: Boolean,
  address: {
    address: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    fullAddress: String,
  },
});

warehouseSchema.pre('save', function(next) {
  address = this.address.address + '\r\n';
  if (this.address.zip) address += this.address.zip + ', ';
  if (this.address.city) address += this.address.city;
  if (this.address.state) address += ', ' + this.address.state;
  address += '\r\n';
  address += this.address.country;
  this.address.fullAddress = address;

  next();
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
