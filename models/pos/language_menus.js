const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const LanguageMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  menu: {
    type: Schema.Types.ObjectId,
    ref: 'Menu'
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: 'LanguageCode'
  },
  deletedAt: {
    type: Date
  }
});

LanguageMenuSchema.plugin(timestamp);

LanguageMenuSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

LanguageMenuSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const LanguageMenu = mongoose.model('LanguageMenu', LanguageMenuSchema);
module.exports = LanguageMenu;