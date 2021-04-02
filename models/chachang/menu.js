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
  }
});

MenuSchema.plugin(timestamp);

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;