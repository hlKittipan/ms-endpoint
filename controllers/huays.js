const Huay = require("../models/huay");
const { DateTime } = require("luxon");

const date = DateTime.local().toFormat("dd/LL/yyyy");
module.exports = {

  findData: (req, res, next) => {
    const huay = Huay.findOne({ date: date }).then(function (value) {
      if (!value) throw createData(req, res, next, true , 0);
      createData(req, res, next, false, value._id);
      // console.log(value)
    });
   
  },
  getDataFromHuay: () => {
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
      Huay.findData(response.data, res, next);
    }).catch(error => {
      console.log(error);
    });
  }
};

function createData (req, res, next, isCreate, id) {
  const data = req.data.yeekee;
  const yeekee = [];
  const date_thai = req.data.now;

  for (const key in data) {
    if (data[key] != null ){
      yeekee[key] = data[key].period.result;
    }
  }
  // console.log(isCreate)
  if (isCreate){
    const huay = new Huay({
      date,
      date_thai,
      yeekee,
    });
    const newHuay = huay.save();
    res.send(201);
    next();
  }else {
    
    const filter = { _id: id };
    const update = { date: date ,date_thai : date_thai,yeekee : yeekee };
    //console.log(update)
    const huay = Huay.findOneAndUpdate(filter, update, {
      returnOriginal: false
    }).then(function (value) {console.log(value)});
    res.send(200);
    next();
  }
}
