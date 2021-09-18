const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const AddOnTypeSchema = new mongoose.Schema({  
  title: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date
  }
});

AddOnTypeSchema.plugin(timestamp);

AddOnTypeSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

AddOnTypeSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const AddOnType = mongoose.model('AddOnType', AddOnTypeSchema);
module.exports = AddOnType;