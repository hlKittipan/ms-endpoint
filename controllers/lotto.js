const Lotto = require("../models/lotto");
const { DateTime } = require("luxon");
const axios = require("axios");
const querystring = require("querystring");
const line = require("@line/bot-sdk");
const config = require("../config");

const date = DateTime.local().toFormat("dd/LL/yyyy");
module.exports = {

  findData: async (req, res, next, current_data, remove_duplicate, user_id) => {
    let newLotto = ''
    const lotto = await Lotto.findOne({ date: date }).then(function (value) {
      if (value == null) {
        newLotto = createData(req, res, next, true , 0, current_data, user_id);
      }else {
        newLotto = createData(value, res, next, false, value._id, current_data, user_id);
      }
    });
    //console.log(newLotto)
    
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


function generateNumber (number) {
  guess_count = 5-parseInt(number.length)
  for (i = 0; i < guess_count; i++) {
    lastNum = (parseInt(number.slice(-1))+1)
    if (lastNum == 10) {
      lastNum = "0"
    }
    number = number+lastNum
  }  
  return number
}

function loopGetNum (number) {
  do {
    numberAfterGenerate = generateNumber(number)
    number = numberAfterGenerate.replace(/(.)(?=.*\1)/g, "");
  } while ( number.length < 5)
  return number
}

async function  createData (req, res, next, isCreate, id, curent_data, user_id) {
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
    await lotto.save().then(function (value) {newLotto = value});
  }else {    
    const filter = { _id: id };
    const update = { date: date ,yeekee : yeekee };
    //console.log(update)
    await Lotto.findOneAndUpdate(filter, update, {
      returnOriginal: false
    })
    .then(function (value) {newLotto = value});
  }

  let msg = "ปักล่างหน่วย 4 รอบมั้ง \r\n";
  let n = 1;
  let result_num = "";
  let re_gen = 1;

  for (const key in newLotto.yeekee) {
    const id = yeekee[key].two_under;
    const one = id.toString().substr(0, 1);
    const two = id.toString().substr(1, 1);
    const number_default = ["12", "627", "230", "245", "326", "370", "079", "802", "562", "68"];
    let guess = number_default[one] + number_default[two]
    let remove_duplicate = guess.replace(/(.)(?=.*\1)/g, "");
    if (key == 0) {
      result_num = loopGetNum(remove_duplicate);
      show = result_num;
    } else {
      let n = result_num.indexOf(two);
      if ( n > -1) {
        msg = msg + "//" + (parseInt(re_gen)-1)
        const tmp_num = loopGetNum(remove_duplicate);
        result_num = tmp_num;
        show = result_num;
        re_gen = 1
      } else {
        show = '';
        if (re_gen > 4){
          msg = msg + "//END"
          const tmp_num = loopGetNum(remove_duplicate);
          result_num = tmp_num;
          show = result_num;
          re_gen = 1
        }
      }
    }
    re_gen++
    if (show != '') {
      msg = msg + "\r\n" + (parseInt(n)+parseInt(key)) + " : " + yeekee[key].three_top + "-" + yeekee[key].two_under + " = " + show 
    }
  }  
  const client = new line.Client({
    channelAccessToken: config.LINE_BOT,
  });
  const message = [
    {
      type: "text",
      text: msg,
    }
  ];
  client
    .pushMessage(user_id, message)
    .then((response) => {
      //console.log(response);
    })
    .catch((err) => {
      //console.log(err.statusCode);
    });

  res.send(msg);
  next();
}


