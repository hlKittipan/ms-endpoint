const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const PaymentTypeSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
  },
  deleted_at: {
    type: Date
  }
});

PaymentTypeSchema.plugin(timestamp);

const PaymentType = mongoose.model('PaymentType', PaymentTypeSchema);
module.exports = PaymentType;