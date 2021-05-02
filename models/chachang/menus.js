const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const MenuSchema = new mongoose.Schema({
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
  price: [],
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'MenuType'
  }],
  deletedAt: {
    type: Date
  }
});

MenuSchema.plugin(timestamp);

MenuSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

MenuSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;