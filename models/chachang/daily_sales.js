const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const DailySaleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    trim: true
  },
  list: {},
  deleted_at: {
    type: Date
  }
});

DailySaleSchema.plugin(timestamp);

const DailySale = mongoose.model('DailySales', DailySaleSchema);
module.exports = DailySale;