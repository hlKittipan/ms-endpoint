const Lotto = require("../models/lotto");
const { DateTime } = require("luxon");
const axios = require("axios");
const querystring = require("querystring");
const line = require("@line/bot-sdk");
const config = require("../config");

const date = DateTime.local().toFormat("dd/LL/yyyy");

const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer Xqhu17b67WG2rcuDibCjTB1oJ1mCtajcuh/dUM2AYpO+M8yb82DiN8XpfTW5It9iJEualWSU8GCPZ3ZFvHmODeJpzsdBvUy6vW5SnVBdOeVACMug5M/hLOb3m7iDdK0xdr8zBmcma5AZZkQog0JLjQdB04t89/1O/w1cDnyilFU=",
};

module.exports = {
  findData: async (req, res, next, current_data, remove_duplicate, user_id) => {
    let newLotto = "";
    const lotto = await Lotto.findOne({ date: date }).then(function (value) {
      if (value === null) {
        newLotto = createData(req, res, next, true, 0, current_data, user_id);
      } else {
        newLotto = createData(value, res, next, false, value._id, current_data, user_id);
      }
    });
  },

  getDataFromLotto: () => {
    axios({
      method: "get",
      url: "https://s1.huay.com/api/lottery/result",
      data: {
        date: date,
        sid: "a9e35080-fb00-11ea-bc07-4b7305fd5878",
        _: Date.now(),
      },
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVpZCI6MjMzNTY2M30sImlhdCI6MTYwMDg3MTM2MX0.PRJTqfbUmNWrJ25zCGsm1y7o1UwhWkFqeRufk52c2tI",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(function (response) {
        //console.log(response)
        //res.send(response.data)
        const current_data = {
          three_top: "801",
          two_top: "01",
          two_under: "21",
        };

        Lotto.findData(false, res, next, current_data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  
  addData: async (current_data, getDate) => {
    let isCreate = false;
    const yeekee = [];
    let last_key = 0;
    let newLotto = "";
    let id = 0;
    
    await Lotto.findOne({ date: getDate }).then(function (value) {
      if (value === null) {
        isCreate = true;
      } else {
       id = value._id;
        for (const key in value.yeekee) {
          if (value.yeekee[key] !== null) {
            yeekee[key] = value.yeekee[key];
            last_key++;
          }
        }
      }
    });

    yeekee[last_key] = current_data;

    if (isCreate) {
      const lotto = new Lotto({
        date,
        yeekee,
      });
      await lotto.save().then(function (value) {
        newLotto = value;
      });
    } else {
      const filter = { _id: id };
      const update = { date: date, yeekee: yeekee };
      //console.log(update)
      await Lotto.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      }).then(function (value) {
        newLotto = value;
      });
    }
    return newLotto;
  },

  getNewResult: async () => {
    const lotto = await Lotto.findOne({ date: date }).then(function (value) {
      if (value) {
        getResultUnitDown(value.yeekee);
        getResultTenDown(value.yeekee);
      }
    });
  },

  getAll: async (reply_token) => {
 
    let result = ""
    const lotto = await Lotto.findOne({ date: date }).then(function (value) {      
      for (const key in value.yeekee) {
        result = result + (parseInt(key)+1) + " : " + value.yeekee[key].three_top + "-" + value.yeekee[key].two_under + "\r\n"
      }
    });
    
    const body = JSON.stringify({
      replyToken: reply_token,
      messages: [
        {
          type: "text",
          text: result,
        },
      ],
    });

    axios
      .post("https://api.line.me/v2/bot/message/reply", body, {
        headers: headers,
      })
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.status);
      });
  },

  removeLotto: async () => {
    const lotto = await Lotto.findOneAndDelete({ date: date })
  },

  removeLottoByKey: async (ref_key, reply_token) => {
    let new_yeekee = []
    let id = ""
    const lotto = await Lotto.findOne({ date: date }).then(function (value) {
      id = value._id;
      for (const key in value.yeekee) {
        if ( (parseInt(key)+1) != ref_key ) {
          new_yeekee.push(value.yeekee[key])
        }
      }
    });
    const filter = { _id: id };
    const update = { date: date ,yeekee : new_yeekee };
    //console.log(update)
    await Lotto.findOneAndUpdate(filter, update, {
      returnOriginal: false
    }).then((value) => {this.getAll(reply_token)});
  },
  
  reply: (reply_token, user_id, msg) => {

    let body = JSON.stringify({
      replyToken: reply_token,
      messages: [
        {
          type: "text",
          text: msg,
        },
      ],
    });

    axios
      .post("https://api.line.me/v2/bot/message/reply", body, {
        headers: headers,
      })
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.status);
      });
  },

  insertLottoByKey: async (f_param, reply_token) => {
    const f_key = f_param.split(" ")[0]
    const f_value = f_param.split(" ")[1]
    const one = f_value.toString().substr(0, 1);
    const two = f_value.toString().substr(1, 1);
    const three = f_value.toString().substr(2, 1);
    const four = f_value.toString().substr(3, 1);
    const five = f_value.toString().substr(4, 1);
    const new_yeekee = []
    let id = ""
    const lotto = await Lotto.findOne({ date: date }).then(function (value) {
      id = value._id;
      for (const key in value.yeekee) {
        if ( (parseInt(key)+1) == f_key ) {
          new_yeekee.push({ 
            "three_top" : one + two + three,
            "two_top" : two + three,
            "two_under" : four + five
          })
          new_yeekee.push(value.yeekee[key])
        }
        new_yeekee.push(value.yeekee[key])
      }
    });
    const filter = { _id: id };
    const update = { date: date ,yeekee : new_yeekee };
    //console.log(update)
    await Lotto.findOneAndUpdate(filter, update, {
      returnOriginal: false
    }).then((value) => {this.getAll(reply_token)});
  },
};

function generateNumber(number) {
  guess_count = 6 - parseInt(number.length);
  for (i = 0; i < guess_count; i++) {
    lastNum = parseInt(number.slice(-1)) + 1;
    if (lastNum == 10) {
      lastNum = "0";
    }
    number = number + lastNum;
  }
  return number;
}

function loopGetNum(number) {
  do {
    numberAfterGenerate = generateNumber(number);
    number = numberAfterGenerate.replace(/(.)(?=.*\1)/g, "");
  } while (number.length < 6);
  return number;
}

async function createData(req, res, next, isCreate, id, current_data, user_id) {
  const data = req != false ? req.yeekee : false;
  const yeekee = [];
  let last_key = 0;

  if (data != false) {
    for (const key in data) {
      if (data[key] !== null) {
        yeekee[key] = data[key];
        last_key++;
      }
    }
  }

  yeekee[last_key] = current_data;

  let newLotto = "";

  if (isCreate) {
    const lotto = new Lotto({
      date,
      yeekee,
    });
    await lotto.save().then(function (value) {
      newLotto = value;
    });
  } else {
    const filter = { _id: id };
    const update = { date: date, yeekee: yeekee };
    //console.log(update)
    await Lotto.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    }).then(function (value) {
      newLotto = value;
    });
  }

  let msg = "ปักล่างหน่วย 4 รอบมั้ง \r\n";
  let n = 1;
  let result_num = "";
  let re_gen = 1;

  for (const key in newLotto.yeekee) {
    const id = yeekee[key].two_under;
    const one = id.toString().substr(0, 1);
    const two = id.toString().substr(1, 1);
    const number_default = [ "012", "267", "325", "245", "365", "376", "479", "287", "562", "680" ];
    let guess = number_default[one] + number_default[two];
    let remove_duplicate = guess.replace(/(.)(?=.*\1)/g, "");
    if (key == 0) {
      result_num = loopGetNum(remove_duplicate);
      show = result_num;
    } else {
      let n = result_num.indexOf(two);
      if (n > -1) {
        msg = msg + "//" + (parseInt(re_gen) - 1);
        const tmp_num = loopGetNum(remove_duplicate);
        result_num = tmp_num;
        show = result_num;
        re_gen = 1;
      } else {
        show = "";
        if (re_gen > 4) {
          msg = msg + "//END";
          const tmp_num = loopGetNum(remove_duplicate);
          result_num = tmp_num;
          show = result_num;
          re_gen = 1;
        }
      }
    }
    re_gen++;
    if (show != "") {
      msg = msg + "\r\n" + (parseInt(n) + parseInt(key)) +" : " + yeekee[key].three_top + "-" + yeekee[key].two_under + " = " + show;
    }
  }

  // const client = new line.Client({
  //   channelAccessToken: config.LINE_BOT,
  // });
  // const message = [
  //   {
  //     type: "text",
  //     text: msg,
  //   }
  // ];
  // client
  //   .pushMessage(user_id, message)
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((err) => {
  //     console.log(err.statusCode);
  //   });

  res.send(msg);
  next();
}

function getResultUnitDown (data) {
  let msg = "ปักล่างหน่วย 4 รอบมั้ง \r\n";
  let n = 1;
  let result_num = "";
  let re_gen = 1;
  let isEnd = true;
  for (const key in data) {
    const id = data[key].two_under;
    const one = id.toString().substr(0, 1);
    const two = id.toString().substr(1, 1);
    const number_default = [ "012", "267", "325", "245", "365", "376", "479", "287", "562", "680" ];
    let guess = number_default[one] + number_default[two];
    let remove_duplicate = guess.replace(/(.)(?=.*\1)/g, "");
    if (key == 0) {
      result_num = loopGetNum(remove_duplicate);
      show = result_num;
    } else {
      let n = result_num.indexOf(two);
      if (n > -1) {
        msg = msg + "/" + (parseInt(re_gen) - 1);
        const tmp_num = loopGetNum(remove_duplicate);
        result_num = tmp_num;
        show = result_num;
        re_gen = 1;
      } else {
        show = "";
        if (re_gen > 4) {
          msg = msg + "/END";
          const tmp_num = loopGetNum(remove_duplicate);
          result_num = tmp_num;
          show = result_num;
          re_gen = 1;
          isEnd = false;

        }
      }
    }
    re_gen++;
    if (show != "") {
      msg = msg + "\r\n" + (parseInt(n) + parseInt(key)) +":" + data[key].three_top + "-" + data[key].two_under + "=" + show;
    }
  }
  if (isEnd == true) {
    axios({
      method: "post",
      url: "https://notify-api.line.me/api/notify",
      headers: {
        Authorization: "Bearer " + config.LINE_NOTIFY_LOTTO,
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
      data: querystring.stringify({
        message: msg,
      }),
    })
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        //console.log(error);
      });
  
  }  
  console.log(msg)
}

function getResultTenDown (data) {
  let msg = "ปักล่างสิบ 4 รอบมั้ง \r\n";
  let n = 1;
  let result_num = "";
  let re_gen = 1;
  let isEnd = true;
  for (const key in data) {
    const id = data[key].two_under;
    const one = id.toString().substr(0, 1);
    const two = id.toString().substr(1, 1);
    const number_default = [ "102", "762", "025", "245", "635", "376", "749", "872", "652", "608" ];
    let guess = number_default[one] + number_default[two];
    let remove_duplicate = guess.replace(/(.)(?=.*\1)/g, "");
    if (key == 0) {
      result_num = loopGetNum(remove_duplicate);
      show = result_num;
    } else {
      let n = result_num.indexOf(one);
      if (n > -1) {
        msg = msg + "/" + (parseInt(re_gen) - 1);
        const tmp_num = loopGetNum(remove_duplicate);
        result_num = tmp_num;
        show = result_num;
        re_gen = 1;
      } else {
        show = "";
        if (re_gen > 4) {
          msg = msg + "/END";
          const tmp_num = loopGetNum(remove_duplicate);
          result_num = tmp_num;
          show = result_num;
          re_gen = 1;
          isEnd = false;
        }
      }
    }
    re_gen++;
    if (show != "") {
      msg = msg + "\r\n" + (parseInt(n) + parseInt(key)) +":" + data[key].three_top + "-" + data[key].two_under + "=" + show;
    }
  }
  if (isEnd == true) {
    axios({
      method: "post",
      url: "https://notify-api.line.me/api/notify",
      headers: {
        Authorization: "Bearer " + config.LINE_NOTIFY_LOTTO,
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
      data: querystring.stringify({
        message: msg,
      }),
    })
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        //console.log(error);
      });
  }


  console.log(msg)
}

