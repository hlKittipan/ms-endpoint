const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
const accessbank = require("../controllers/bank");
const { DateTime } = require("luxon");
const axios = require("axios");
const date = DateTime.local().toFormat("dd/LL/yyyy");

module.exports = (server) => {
  server.get("/getaccess", async (req, res, next) => {
    accessbank.getAccess();
  })
}