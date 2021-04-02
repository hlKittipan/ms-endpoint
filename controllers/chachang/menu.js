const { json } = require("body-parser");
const { DateTime } = require("luxon");
const axios = require("axios");
const _ = require("lodash");
const Menu = require("../../models/chachang/Menu");

module.exports = {
  index: async (req, res, next) => {},
  fetchData: async (req, res, next) => {
    const result = await Menu.find()
    res.status(200).send(result);
    next();
  },

  store: async (req, res, next) => {
    try {
      const data = new Menu({
        name: req.body.name,
        name_th: req.body.name_th,
        price: req.body.price,
        type: req.body.type,
      });
      const result = await data.save()
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  },
};
