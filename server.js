require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./configs/index");
const state = { isShutdown: false };
const axios = require("axios");
const bodyParser = require("body-parser");

mongoose.Promise = global.Promise;
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
mongoose.connection;

app.listen(config.PORT, () => {
  console.log("Server started on port " + config.PORT);
});

app.on("error", (err) => console.log(err));

require("./routes/customers")(app);
require("./routes/users")(app);
require("./routes/access_bank")(app);
require("./routes/chachang/menu")(app);
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

app.use(function errorHandler (err, req, res, next) {
  
  if (res.headersSent) {
    return next(err)
  }
  // res.status(500)
  // res.render('error', { error: err })
  res.status(500).json({ status: false })
})

// Graceful Shutdown
const gracefulShutdown = () => {
  axios.post("http://localhost:" + process.env.PORT + "/stop-agenda");
  state.isShutdown = true;
  console.info(
    "Got SIGTERM. Graceful shutdown start",
    new Date().toISOString()
  );
  app.close(() => {
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
