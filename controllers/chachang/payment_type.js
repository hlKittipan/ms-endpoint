const { DateTime } = require("luxon");
const axios = require("axios");
const _ = require("lodash");
const paymentType = require("../../models/chachang/payment_types");

module.exports = {
  index: async (req, res, next) => {},
  fetchData: async (req, res, next) => {
    try {
      const result = await paymentType.findAvailable();
      res.status(200).send(result);
      next();
    } catch (error) {
      next(error);
    }
  },

  store: async (req, res, next) => {
    console.log(req.body)
    try {
      const data = new paymentType({
        name: req.body.name,      
      });
      const result = await data.save();
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    try {
      const result = await paymentType.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          name: req.body.name,          
        },{ new: true }
      );
      res.status(200).send(result);
      next();
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    console.log(req.params)
    try {
      const result = await paymentType.softDelete(req.params.id);
      if (result === null) {
        res.status(404).send(result);
      }else {
        res.status(200).send({ status : 'Delete success' });
      }
      next();
    } catch (error) {
      next(error);
    }
  }
};
