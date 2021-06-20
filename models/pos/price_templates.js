const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const PriceTemplateSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
  },
  price: [],
  deletedAt: {
    type: Date
  }
});

PriceTemplateSchema.plugin(timestamp);

PriceTemplateSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

PriceTemplateSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const PriceTemplate = mongoose.model('PriceTemplate', PriceTemplateSchema);
module.exports = PriceTemplate;