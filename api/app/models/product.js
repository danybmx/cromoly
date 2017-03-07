const mongoose = require('mongoose');
const softDelete = require('mongoose-soft-delete');
const Schema = mongoose.Schema;

const productOptionSchema = new Schema({
  ean: {type: String},
  reference: {type: String},
  name: {type: String, required: true},
  slug: {type: String, required: true},
  price: {type: Number, required: true},
  taxes: [{type: Schema.Types.ObjectId, ref: 'Tax'}],
  priceWithTaxes: {type: Number, required: true},
  buyPrice: {type: Number},
  buyTaxes: [{type: Schema.Types.ObjectId, ref: 'Tax'}],
  buyPriceWithTaxes: {type: Number},
  discount: {type: Number},
  buyDiscount: {type: Number},
  stock: [
    {
      warehouse: {type: Schema.Types.ObjectId, ref: 'Warehouse'},
      units: {type: Number, required: true},
    },
  ],
  images: [{file: {type: String, required: true}}],
});

productOptionSchema.plugin(softDelete, {select: false});

const productSchema = new Schema({
  name: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  description: {type: String, required: true},
  visible: {type: Boolean, default: true},
  featured: {type: Boolean, default: false},
  onDemand: {type: Boolean, default: false},
  options: [productOptionSchema],
  images: [{file: {type: String, required: true}}],
  category: {
    type: Schema.Types.ObjectId, ref: 'Category',
    required: true,
  },
  brand: {
    type: Schema.Types.ObjectId, ref: 'Brand',
    required: true,
  },
}, {timestamps: true});

productSchema.plugin(softDelete, {select: false});

module.exports = mongoose.model('Product', productSchema);
