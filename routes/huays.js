const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
const Huay = require("../controllers/huays");
const Lotto = require("../controllers/lotto");
const config = require("../config");
const { DateTime } = require("luxon");
const axios = require("axios");
const cron = require("node-cron");

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
    const id = req.params.id;
    const one = id.toString().substr(0, 1);
    const two = id.toString().substr(1, 1);
    const three = id.toString().substr(2, 1);
    const four = id.toString().substr(3, 1);
    const five = id.toString().substr(4, 1);
    const number_default = ["12", "627", "230", "245", "326", "370", "079", "802", "562", "68"];
    const current_data = { 
      "three_top" : one + two + three,
      "two_top" : two + three,
      "two_under" : four + five
    }
    const token = "pUcyPPJaouiRpluVhIKIwoV1mcC1qkuLLJueaR6m6cm";
    var msg = one + two + three + four + five;
    let guess = number_default[four] + number_default[five]
    let remove_duplicate = guess.replace(/(.)(?=.*\1)/g, "");

    // axios({
    //   method: "post",
    //   url: "https://notify-api.line.me/api/notify",
    //   headers: {
    //     Authorization: "Bearer " + token,
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   data: querystring.stringify({
    //     message: msg,
    //   }),
    // })
    //   .then(function (response) {
    //     //console.log(response);
    //   })
    //   .catch(function (error) {
    //     //console.log(error);
    //   });
    const result =  Lotto.findData(false, res, next, current_data, remove_duplicate);
    // res.send(result);
    // next();
  });
};

cron.schedule("00 5 * * * *", function () {
  // Huay.getDataFromHuay()
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 20 * * * *", function () {
  // Huay.getDataFromHuay()
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 35 * * * *", function () {
  // Huay.getDataFromHuay()
  console.log(DateTime.local().toFormat("F"));
});

cron.schedule("00 50 * * * *", function () {
  // Huay.getDataFromHuay()
  console.log(DateTime.local().toFormat("F"));
});
