const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: [],
  language:{},
  type: {
    type: Schema.Types.ObjectId,
    ref: 'ProductType'
  },
  deletedAt: {
    type: Date
  } 
});

ProductSchema.plugin(timestamp);

ProductSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

ProductSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;