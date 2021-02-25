const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
const accessbank = require("../controllers/bank");
const { DateTime } = require("luxon");
const axios = require("axios");
const date = DateTime.local().toFormat("dd/LL/yyyy");

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
};
