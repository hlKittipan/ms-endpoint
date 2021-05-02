const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const MenuTypeSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date
  }
});

MenuTypeSchema.plugin(timestamp);

MenuTypeSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

MenuTypeSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const MenuType = mongoose.model('MenuType', MenuTypeSchema);
module.exports = MenuType;