const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const LanguageCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },  
  code: {
    type: String,
    required: true,
    trim: true
  },
  deletedAt: {
    type: Date
  }
});

LanguageCodeSchema.plugin(timestamp);

LanguageCodeSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

LanguageCodeSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const LanguageCode = mongoose.model('LanguageCode', LanguageCodeSchema);
module.exports = LanguageCode;