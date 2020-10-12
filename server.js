const express = require("express");
// const cors = require("cors");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const app = express();
const restify = require("restify");
const config = require("./config");
const rjwt = require("restify-jwt-community");
const axios = require("axios");
const querystring = require("querystring");
const { DateTime } = require("luxon");


const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Protext routes
//server.use(rjwt({ secret: config.JWT_SERCRET}).unless({ path: ['/auth']}));

server.listen(config.PORT, () => {
  mongoose.set("useFindAndModify", false);
  mongoose
    .connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        console.log("[success] task  : connected to the database ");
      },
      (error) => {
        console.log("[failed] task  " + error);
        process.exit();
      }
    );
});

const db = mongoose.connection;

db.on("error", (err) => console.log(err));

db.once("open", () => {
  require("./routes/customers")(server);
  require("./routes/users")(server);
  require("./routes/huays")(server);
  console.log("Server started on port " + config.PORT);
});

// test
server.get("/", async (req, res, next) => {
  res.send("Hello world" + Date.now());
});

server.post("/webhook", async (req, res, next) => {
  const token = "sxZX9ZftGr17P6Hrc7M4pBi67B3Q4yyBOEyciKrtVwu";
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  let user_id = req.body.events[0].source.userId;
  if (req.body.events[0].source.hasOwnProperty("groupId")) {
    user_id = req.body.events[0].source.groupId;
  }
  let check_case = msg.split(" ")[0]
  check_case = check_case.toUpperCase();
 
  switch (check_case) {
    case "HI":
      reply(reply_token, user_id, "What's up.");
      break;
    case "RESET":
      removeLotto()
      reply(reply_token, user_id, "Reset success.");
      break;
    case "REMOVE":
      removeLottoByKey( msg.split(" ")[1], reply_token)
      reply(reply_token, user_id, "Remove success.");
      break;
    case "ALL":
      getAll(reply_token);
      break;
  }

  if ( check_case === "ADD") {
    axios
      .get(
        "https://line-bot-my-ks.herokuapp.com/lotto/" +
          msg.split(" ")[1] + "," + reply_token
      )
      .then(function (response) {
        console.log(response.data);
        reply(reply_token, user_id, response.data);
      })
      .catch(function (error) {
        console.log(error.response.status);
      });
  }

  res.send(200);
});

const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer Xqhu17b67WG2rcuDibCjTB1oJ1mCtajcuh/dUM2AYpO+M8yb82DiN8XpfTW5It9iJEualWSU8GCPZ3ZFvHmODeJpzsdBvUy6vW5SnVBdOeVACMug5M/hLOb3m7iDdK0xdr8zBmcma5AZZkQog0JLjQdB04t89/1O/w1cDnyilFU=",
};
const date = DateTime.local().toFormat("dd/LL/yyyy");


function reply(reply_token, user_id, msg) {

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
}


const Lotto = require("./models/lotto");

async function getAll(reply_token) {
 
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
}

async function removeLotto() {
  const lotto = await Lotto.findOneAndDelete({ date: date })
}

async function removeLottoByKey(ref_key, reply_token) {
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
  }).then(function (value) {getAll(reply_token)});
}

// app.use(bodyParser.json());

// const jwt = require("jwt-simple");
// const passport = require("passport");

// //ใช้ในการ decode jwt ออกมา
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// //ใช้ในการประกาศ Strategy
// const JwtStrategy = require("passport-jwt").Strategy;

// const SECRET = "MY_SECRET_KEY";
// //สร้าง Strategy
// const jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromHeader("authorization"),
//     secretOrKey: SECRET
// };
// const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
//     if (payload.sub === "kennaruk") done(null, true);
//     else done(null, false);
// });
// //เสียบ Strategy เข้า Passport
// passport.use(jwtAuth);

// var mongo_uri = "";
// mongoose.Promise = global.Promise;

// app.use(cors());

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }))

// // const middleware = (req, res, next) => {
// //     /* ตรวจสอบว่า authorization  หรือไม่*/
// //     if (req.headers.authorization === "Boy")
// //         next(); //อนุญาตให้ไปฟังก์ชันถัดไป
// //     else
// //         res.send("ไม่อนุญาต")
// // };

// const requireJWTAuth = passport.authenticate("jwt", {
//     session: false
// });

// //ทำ Middleware สำหรับขอ JWT
// const loginMiddleWare = (req, res, next) => {
//     if (req.body.username === "kennaruk" &&
//         req.body.password === "mak") next();
//     else res.send("Wrong username and password");
// };
// app.post("/login", loginMiddleWare, (req, res) => {
//     const payload = {
//         sub: req.body.username,
//         iat: new Date().getTime()
//     };
//     res.send(jwt.encode(payload, SECRET));
// });

// app.get('/', requireJWTAuth, (req, res) => {
//     res.send('Hello World')
// })

// // app.listen(3000, () => {
// //     console.log('Start server at port 3000.')
// // })

// // path สำหรับ MongoDB ของเรา
// var POSTS = require("./routes/posts");
// app.use("/api/posts", POSTS);

// app.use((req, res, next) => {
//     var err = new Error("ไม่พบ path ที่คุณต้องการ");
//     err.status = 404;
//     next(err);
// });

// const posts = require('./db.json')

// app.get('/posts', (req, res) => {
//     res.json(posts)
// })

// app.get('/posts/:id', (req, res) => {
//     res.json(posts.find(post => post.id === req.params.id))
// })

// app.post('/posts', (req, res) => {
//     posts.push(req.body)
//     res.status(201).json(req.body)
// })

// app.put('/posts/:id', (req, res) => {
//     const updateIndex = posts.findIndex(post => post.id === req.params.id)
//     res.json(Object.assign(posts[updateIndex], req.body))
// })

// app.delete('/posts/:id', (req, res) => {
//     const deletedIndex = posts.findIndex(post => post.id === req.params.id)
//     posts.splice(deletedIndex, 1)
//     res.status(204).send()
// })
