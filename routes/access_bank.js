const accessbank = require("../controllers/bank");
const scb = require("../controllers/scb");
const { DateTime } = require("luxon");
const date = DateTime.local().toFormat("dd/LL/yyyy");
const cron = require("node-cron")
const mongoConnectionString = process.env.MONGODB_URI_SCB;
const Agenda = require("agenda")
const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
  }
});

module.exports = (server) => {
  server.get("/getaccess", async (req, res, next) => {
    accessbank.getAccess(req, res, next);
  });
  server.get("/getImgKiriacoulis", async (req, res, next) => {
    accessbank.getImgKiriacoulis(req, res, next);
  });
  server.get("/getImgKiriacoulisplan", async (req, res, next) => {
    accessbank.getImgKiriacoulisPlan(req, res, next);
  });
  server.get("/getRemovefolder", async (req, res, next) => {
    accessbank.getRemoveFolder(req, res, next);
  });
  server.get("/copyFileTest", async (req, res, next) => {
    accessbank.copyFileTest(req, res, next);
  });
  server.get("/scb", async (req, res, next) => {
    scb.index(req, res, next);
  })
  server.get("/stop-agenda", async (req, res, next) => {
    agenda.stop();
  })
  server.get("/start-agenda", async (req, res, next) => {
    agenda.start();
  })
};
agenda.define("get transection scb", async (job,done) => {
  let countDownGetBnk = Math.floor(Math.random()* Math.floor(5));
  console.log(countDownGetBnk)
  setTimeout(() => {
    console.log(DateTime.local().toFormat("F HH:mm:ss"))
  }, countDownGetBnk);
  done();
});
(async function () {
  // IIFE to give access to async/await

  agenda.on('ready', async () => { // wait for mongo connection.
    await agenda.every("1 seconds", "get transection scb");
    await agenda.start();
  })
})();





