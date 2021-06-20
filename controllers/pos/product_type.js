const { DateTime } = require("luxon");
const axios = require("axios");
const _ = require("lodash");
const productType = require("../../models/pos/product_types");
const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../../helpers/error')

module.exports = {
  index: async (req, res, next) => {},
  fetchData: async (req, res, next) => {
    try {
      const result = await productType.findAvailable();
      res.status(200).send(result);
    } catch (error) {
      next(new ErrorHandler(500, error, error))
    }
  },

  store: async (req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(422, errors, errors))
    }
    try {
      const data = new productType({...req.body,});
      const result = await data.save();
      if (result) {
        res.status(200).send(result);
      }else{
        next(new ErrorHandler(500 , result, 'Something wrong!'))
      }
    } catch (error) {
      next(new ErrorHandler(422, error, error))
    }
  },

  update: async (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(422, errors, 'Invalid value'))
    }
    try {
      const item = req.body
      const result = await productType.findOneAndUpdate({_id: req.params.id,},{...item},{ new: true });
      if (result) {
        res.status(200).send(result);
      }else{
        next(new ErrorHandler(404, result, 'Not found!'))
      }
    } catch (error) {
      next(new ErrorHandler(422, error, error))
    }
  },

  delete: async (req, res, next) => {
    console.log(req.params)
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(422, errors, 'Invalid value'))
    }
    try {
      const result = await productType.softDelete(req.params.id);
      if (result) {
        res.status(200).send({ status : 'Delete success' });
      }else{
        next(new ErrorHandler(404, result, 'Not found!'))
      }
    } catch (error) {
      next(new ErrorHandler(422, error, error))
    }
  }
}; 
