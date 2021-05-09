const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const ProductTypeSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date
  }
});

ProductTypeSchema.plugin(timestamp);

ProductTypeSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

ProductTypeSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const ProductType = mongoose.model('ProductType', ProductTypeSchema);
module.exports = ProductType;