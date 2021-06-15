const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const SettingSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date
  }
});

SettingSchema.plugin(timestamp);

SettingSchema.statics.findAvailable = function (cb) {
  return this.find({
    deletedAt: null
  }, cb);
};

SettingSchema.statics.softDelete = function (cb) {
  return this.findOneAndUpdate({
    _id: cb
  }, {
    deletedAt: Date.now()
  });
};

const Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;