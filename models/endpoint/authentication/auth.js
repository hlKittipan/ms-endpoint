const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date
  }
});

UserSchema.plugin(timestamp);

UserSchema.statics.findAvailable = function (cb) {
  return this.find({
    deletedAt: null
  }, cb);
};

UserSchema.statics.softDelete = function (cb) {
  return this.findOneAndUpdate({
    _id: cb
  }, {
    deletedAt: Date.now()
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;