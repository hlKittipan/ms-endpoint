const Lotto = require("../models/lotto");
const { DateTime } = require("luxon");

const date = DateTime.local().toFormat("dd/LL/yyyy");
module.exports = {

  findData: (req, res, next, current_data) => {
    let newLotto = ''
    const lotto = Lotto.findOne({ date: date }).then(function (value) {
      if (value == null) {
        newLotto = createData(req, res, next, true , 0, current_data);
      }else {
        newLotto = createData(value, res, next, false, value._id, current_data);
      }
    });
    console.log(newLotto)
    next(lotto)
  },

  getDataFromLotto: () => {
    axios({
      method: "get",
      url: "https://s1.huay.com/api/lottery/result",
      data: {
        date: DateTime.local().toFormat("dd/LL/yyyy"),
        sid: "a9e35080-fb00-11ea-bc07-4b7305fd5878",
        _: Date.now(),
      },
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVpZCI6MjMzNTY2M30sImlhdCI6MTYwMDg3MTM2MX0.PRJTqfbUmNWrJ25zCGsm1y7o1UwhWkFqeRufk52c2tI",
        "Access-Control-Allow-Origin": "*",
      },
    }).then(function (response) {
      //console.log(response)
      //res.send(response.data)
      const current_data = { 
        "three_top" : "801",
        "two_top" : "01",
        "two_under" : "21"
      }

      Lotto.findData(false, res, next, current_data);
    }).catch(error => {
      console.log(error);
    });
  }
};

function createData (req, res, next, isCreate, id, curent_data) {
  const data = req != false ? req.yeekee : false ;
  const yeekee = [];
  let last_key = 0

  if (data != false) {
    for (const key in data) {
      if (data[key] != null ){
        yeekee[key] = data[key];
        last_key++
      }
    }    
  } 

  yeekee[last_key] = curent_data

  let newLotto = ""

  if (isCreate){
    const lotto = new Lotto({
      date,
      yeekee,
    });
    lotto.save().then(function (value) {newLotto = value});
  }else {    
    const filter = { _id: id };
    const update = { date: date ,yeekee : yeekee };
    //console.log(update)
    newLotto = Lotto.findOneAndUpdate(filter, update, {
      returnOriginal: false
    })
    //.then(function (value) {console.log(value)});
  }
  return newLotto;
}
