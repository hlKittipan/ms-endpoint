const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const LottoSchema = new mongoose.Schema({
  date: {
    type: String
  },
  date_thai: {
    type: String 
  },
  yeekee: {}
});

LottoSchema.plugin(timestamp);

const Lotto = mongoose.model('Lotto', LottoSchema);
module.exports = Lotto;