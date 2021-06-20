require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require("mongoose");
const config = require("./configs/index");
const state = { isShutdown: false };
const axios = require("axios");
const { handleError,ErrorHandler } = require('./helpers/error')
const morgan = require('morgan');
const { DateTime } = require("luxon");
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose
  .connect(config.MONGODB_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
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
mongoose.connection;

const server = app.listen(config.PORT, () => {
  console.log("Server started on port " + config.PORT);
});
//Enable All CORS Requests
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())

app.use(passport.initialize())

//middleware network logging
app.use(morgan(`\u001b[32m:date[iso]\u001b[0m :remote-addr :remote-user \u001b[31m:method\u001b[0m :url HTTP/:http-version \u001b[35m:status\u001b[0m :res[content-length] - \u001b[36m:response-time ms\u001b[0m`))

app.on("error", (err) => console.log(err));

const { networkInterfaces } = require('os');

const nets = networkInterfaces();

const parser = require('ua-parser-js');

app.use((req, res, next) => {
  
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }
              results[name].push(net.address);
          }
      }
  }
  const ua = parser(req.headers['user-agent']);
  console.log(results)
  console.log(JSON.stringify(ua, null, '  '));  
  next()
})

require("./routes/endpoint/authenication/auth")(app);
require("./routes/customers")(app);
// require("./routes/access_bank")(app);
require("./routes/pos/product")(app);
require("./routes/pos/product_type")(app);
require("./routes/pos/payment_type")(app);
require("./routes/pos/price_type")(app);
require("./routes/pos/price_template")(app);
require("./routes/pos/order")(app);
require("./routes/pos/language")(app);
// require("./routes/huays")(app);

// test
app.get("/", async (req, res, next) => {
  res.send("Hello world" + Date.now());
});

app.get("/healthz", (req, res) => {
  if (state.isShutdown) {
    res.status(500).send("respon not ok");
  }
  res.status(200).send("respon ok");
});

//handle error url not found
app.all("*", function (req, res, next) {
  console.log("handle error url")
  // res.status(301).send('Url not found!');
  next(new ErrorHandler(301, `${req.ip} tried to access ${req.originalUrl}`,'Url not found!'));
  // next()
});

//handle error
app.use(handleError);

// Graceful Shutdown
const gracefulShutdown = () => {
  axios.post("http://localhost:" + process.env.PORT + "/stop-agenda");
  state.isShutdown = true;
  console.info(
    "Got SIGTERM. Graceful shutdown start",
    new Date().toISOString()
  );
  server.close(() => {
    console.log("Closed out remaining connections.");
    mongoose.connection.close(false, () => {
      console.log("MongoDb connection closed.");
    });
    process.exit();
  });
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit();
  }, 10 * 1000);
};
// listen for TERM signal .e.g. kill
process.on("SIGTERM", gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on("SIGINT", gracefulShutdown);

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
