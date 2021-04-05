const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

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
  price: {},
  type: {
    type: String
  },
  deleted_at: {
    type: Date
  }
});

MenuSchema.plugin(timestamp);

MenuSchema.statics.findAvailable = function(cb) {
  return this.find({ deleted_at:null }, cb);
};

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;