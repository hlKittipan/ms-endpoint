const cron = require("node-cron");
const querystring = require("querystring");
const { json } = require("body-parser");
const cheerio = require("cheerio");
const config = require("../config");
const request = require("request");
const rp = require("request-promise");

module.exports = {
  getAccess: (req, res, next) => {
    rp({
      uri: "https://thestoryks.com/",
      transform: body => {
        return cheerio.load(body)
      },
    })
      .then($ => {
        console.log($('#post-604 > header > h2 > a').attr('href'))
      })
      .catch(e => {
        console.error(e)
      })
  }
}
