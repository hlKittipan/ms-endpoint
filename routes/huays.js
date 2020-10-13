const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
const Huay = require("../controllers/huays");
const Lotto = require("../controllers/lotto");
const config = require("../config");
const { DateTime } = require("luxon");
const axios = require("axios");
const cron = require("node-cron");
const querystring = require("querystring");
const { json } = require("body-parser");
const cheerio = require('cheerio')


const options = {
  url: "https://s1.huay.com/api/lottery/result",
  method: "get",
  data: {
    date: DateTime.local().toFormat("DD/MM/YYYY"),
    sid: "a9e35080-fb00-11ea-bc07-4b7305fd5878",
    _: Date.now(),
  },
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVpZCI6MjMzNTY2M30sImlhdCI6MTYwMDg3MTM2MX0.PRJTqfbUmNWrJ25zCGsm1y7o1UwhWkFqeRufk52c2tI",
  },
};

module.exports = (server) => {
  server.get("/huay", async (req, res, next) => {
    try {
      // const req = await axios.get(options);
      // req.then((res) => {
      //   console.log(res);
      // });
      await axios({
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
      })
        .then(function (response) {
          //console.log(response)
          //res.send(response.data)
          Huay.findData(response.data, res, next);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  server.get("/huay/:id", async (req, res, next) => {
    const id = req.params.id;
    const arr_id = id.split("-");
    const upthree = arr_id[0];
    const uptwo = upthree.toString().substr(1, 2);
    const downtwo = arr_id[1];

    var result = (
      (parseInt(upthree) + parseInt(uptwo) + parseInt(downtwo)) *
      2 *
      2
    ).toString();
    result = result.substr(result.length - 3);
    const token = "pUcyPPJaouiRpluVhIKIwoV1mcC1qkuLLJueaR6m6cm";
    var msg = result;
    console.log(msg);
    axios({
      method: "post",
      url: "https://notify-api.line.me/api/notify",
      headers: {
        Authorization: "Bearer " + token,
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
    res.send(result);
  });

  server.get("/lotto/:id", async (req, res, next) => {
    let getReq = req.params.id.split(",")
    const id = getReq[0];
    const one = id.toString().substr(0, 1);
    const two = id.toString().substr(1, 1);
    const three = id.toString().substr(2, 1);
    const four = id.toString().substr(3, 1);
    const five = id.toString().substr(4, 1);
    const current_data = { 
      "three_top" : one + two + three,
      "two_top" : two + three,
      "two_under" : four + five
    }
    const token = "pUcyPPJaouiRpluVhIKIwoV1mcC1qkuLLJueaR6m6cm";
    
    const result =  Lotto.findData(false, res, next, current_data, getReq[1]);
    // res.send(result);
    // next();
  });

  server.get("/getlottoresult",async (req,res,next) => {
    let newLotto = "";
    await axios({
      method: "get",
      url: "https://www.lottovip093.com/",
    }).then(function (response) {
      const $ = cheerio.load(response.data)
      const upthree = $($(".border-danger p")[0]).html()
      const uptwo = upthree.toString().substr(1, 2);
      const downtwo = $($(".border-danger p")[0]).html()
      const current_data = { 
        "three_top" : upthree,
        "two_top" : uptwo,
        "two_under" : downtwo
      }
      newLotto = new Promise((resolve, reject) => {resolve(Lotto.addData(current_data, DateTime.local().toFormat("DD/MM/YYYY")))});
      newLotto.then( (val) => console.log("asynchronous logging has val:",val) );
      res.send(200)
    }).catch(error => {
      console.log(error);
    });
  })

  server.get("/getnewresult", async (req, res, next) => {
    let newLotto = "";
    Lotto.getNewResult();
    //console.log(newLotto)
    res.send(200);
    next();
  })

};

function syncDataCronTime(getDate) {
  let newLotto = "";
  axios({
    method: "get",
    url: "https://www.lottovip.com/login",
  }).then(function (response) {
    const $ = cheerio.load(response.data)
    const upthree = $($(".border-danger p")[0]).html()
    const uptwo = upthree.toString().substr(1, 2);
    const downtwo = $($(".border-danger p")[1]).html()
    const current_data = { 
      "three_top" : upthree,
      "two_top" : uptwo,
      "two_under" : downtwo
    }
    newLotto = new Promise((resolve, reject) => {resolve(Lotto.addData(current_data, getDate))});
    newLotto.then( (val) => console.log("asynchronous logging has val:",val) );
    freeNotifyResult(current_data)
  }).catch(error => {
    console.log(error);
  });
}

function freeNotifyResult (result) {
  var msg = DateTime.local().minus({minute : 4}).toFormat("HH:mm") + ' : ' + result.three_top + "-" + result.two_under;
  console.log("Free : " + msg);
  axios({
    method: "post",
    url: "https://notify-api.line.me/api/notify",
    headers: {
      Authorization: "Bearer " + config.LINE_NOTIFY_FREE_LOTTO,
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
//Midnight to 5 AM
cron.schedule("00 4 0-5 * * *", function () {
  // Huay.getDataFromHuay()
  syncDataCronTime(DateTime.local().minus({day : 1}).toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 19 0-5 * * *", function () {
  // Huay.getDataFromHuay()
  syncDataCronTime(DateTime.local().minus({day : 1}).toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 34 0-5 * * *", function () {
  // Huay.getDataFromHuay()
  syncDataCronTime(DateTime.local().minus({day : 1}).toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 49 0-5 * * *", function () {
  // Huay.getDataFromHuay()
  syncDataCronTime(DateTime.local().minus({day : 1}).toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});
//End Midnight to 5 AM

//6 AM to 23 PM
cron.schedule("00 4 23-6 * * *", function () {
  // Huay.getDataFromHuay()
  syncDataCronTime(DateTime.local().toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 19 23-6 * * *", function () {
  // Huay.getDataFromHuay()
  syncDataCronTime(DateTime.local().toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 34 23-6 * * *", function () {
  // Huay.getDataFromHuay()
  syncDataCronTime(DateTime.local().toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 49 23-6 * * *", function () {
  // Huay.getDataFromHuay()
  axios({
    method: "get",
    url: "localhost:3000/getnewresult",
  })
    .then(function (response) {
      //console.log(response);
    })
    .catch(function (error) {
      //console.log(error);
    });
  syncDataCronTime(DateTime.local().toFormat("dd/LL/yyyy"))
  console.log(DateTime.local().toFormat("F"));
});
//End 6 AM to 23 PM