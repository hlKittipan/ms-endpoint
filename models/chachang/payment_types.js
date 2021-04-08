const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const PaymentTypeSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date
  }
});

PaymentTypeSchema.plugin(timestamp);

PaymentTypeSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

PaymentTypeSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const PaymentType = mongoose.model('PaymentType', PaymentTypeSchema);
module.exports = PaymentType;