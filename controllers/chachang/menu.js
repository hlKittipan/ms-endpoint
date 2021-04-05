const { DateTime } = require("luxon");
const axios = require("axios");
const _ = require("lodash");
const Menu = require("../../models/chachang/menus");

module.exports = {
  index: async (req, res, next) => {},
  fetchData: async (req, res, next) => {
    const result = await Menu.findAvailable();
    res.status(200).send(result);
    next();
  },

  store: async (req, res, next) => {
    console.log(req.body)
    try {
      const data = new Menu({
        name: req.body.name,
        name_th: req.body.name_th,
        price: req.body.price,
        type: req.body.type,
      });
      const result = await data.save();
      res.status(200).send(result);
    } catch (error) {
      // res.status(400).send(error);
    }
  },

  update: async (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    try {
      const result = await Menu.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          name: req.body.name,
          name_th: req.body.name_th,
          price: req.body.price,
          type: req.body.type,
        }
      );
      res.status(200).send(result);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          "There is no menu with the id of " + req.params.id
        )
      );
    }
  },

  delete: async (req, res, next) => {
    console.log(req.params)
    try {
      const result = await Menu.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          updated_at: Date.now
        }
      );
      console.log(result)
      res.status(200).send(result);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          "There is no menu with the id of " + req.params.id
        )
      );
    }
  }
};
