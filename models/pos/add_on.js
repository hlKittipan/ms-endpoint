const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const AddOnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
  },
  language:{},
  type: {
    type: Schema.Types.ObjectId,
    ref: 'AddOnType'
  },
  deletedAt: {
    type: Date
  } 
});

AddOnSchema.plugin(timestamp);

AddOnSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

AddOnSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const AddOn = mongoose.model('AddOn', AddOnSchema);
module.exports = AddOn;