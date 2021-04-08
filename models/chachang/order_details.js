const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const OrderDetailSchema = new mongoose.Schema({
  date: {
    type: Date,
    trim: true,
    default: Date.now()
  },
  order: [{
      type: Schema.Types.ObjectId, 
      ref: 'Order' 
  }],
  product: [{
      type: Schema.Types.ObjectId, 
      ref: 'Menu' 
  }],
  payment: [{
    type: Schema.Types.ObjectId, 
    ref: 'PaymentType' 
  }],
  qty: {
    type: Number,
    trim: true,
    default:0
  },
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

OrderDetailSchema.plugin(timestamp);

OrderDetailSchema.statics.softDelete = function(cb) {
  return this.findOneAndUpdate( { _id: cb }, { deletedAt: Date.now() });
};

const OrderDetail = mongoose.model('OrderDetail', OrderDetailSchema);
module.exports = OrderDetail;