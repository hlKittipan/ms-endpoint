const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const AddonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  name_th: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    default: 0
  },
  type: {
    type: String
  }
});

AddonSchema.plugin(timestamp);

const Addon = mongoose.model('Addon', AddonSchema);
module.exports = Addon;