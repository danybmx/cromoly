const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customer: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  storage: {type: Schema.Types.ObjectId, ref: 'Storage', required: true},
  parent: {type: Schema.Types.ObjectId, ref: 'Order'},
  orderType: {
    type: String,
    required: true,
    enum: ['BUDGET', 'ORDER', 'INVOICE'],
    default: 'ORDER',
  },
  reference: {type: String, required: true},
  customerName: {type: String, required: true},
  vat: String,
  mail: {type: String, required: true},
  phone: String,
  billingAddress: {
    address: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  products: [
    {
      product: {type: Schema.Types.ObjectId, ref: 'Product'},
      productOption: {type: Schema.Types.ObjectId, ref: 'ProductOption'},
      reference: String,
      ean: String,
      name: String,
      price: Number,
      units: Number,
      discount: Number,
      total: Number,
    },
  ],
  notes: String,
  discount: String,
  subtotal: String,
  shipping: String,
  total: String,
  // Shipping
  sent: Date,
  tracking: String,
  courrier: String,
  // Payment
  paid: Date,
  paymentMethod: String,
  paymentTransaction: String,
  paymentInfo: [String],
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);
