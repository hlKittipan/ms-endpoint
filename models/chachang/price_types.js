const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const PriceTypeSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date
  }
});

PriceTypeSchema.plugin(timestamp);

PriceTypeSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

PriceTypeSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const PriceType = mongoose.model('PriceType', PriceTypeSchema);
module.exports = PriceType;