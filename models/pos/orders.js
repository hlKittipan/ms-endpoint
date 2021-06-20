const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    trim: true,
    default: Date.now()
  },
  order_detail: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderDetail'
  }],
  sub_total: {
    type: Number,
    default:0.00
  },
  discount_per: {
    type: Number,
    default:0
  },
  discount_number: {
    type: Number,
    default:0.00
  },
  discount_note: {
    type: String,
  },
  total: {
    type: Number,
    default:0.00
  },
  status: {
    type: String,
    default:'Draft'
  },
  deletedAt: {
    type: Date
  }
});

OrderSchema.plugin(timestamp);

OrderSchema.statics.findAvailable = function(cb) {
  return this.find({ deletedAt:null }, cb);
};

OrderSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;