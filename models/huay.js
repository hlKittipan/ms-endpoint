const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const HuaySchema = new mongoose.Schema({
  date: {
    type: String
  },
  date_thai: {
    type: String 
  },
  yeekee: {}
});

HuaySchema.plugin(timestamp);

const Huay = mongoose.model('Huay', HuaySchema);
module.exports = Huay;