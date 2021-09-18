const { DateTime } = require("luxon");
const _ = require("lodash");
const AddOn = require("../../models/pos/add_on");
const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../../helpers/error')

module.exports = {
  index: async (req, res, next) => {
    try {
      const result = await AddOn.find().populate('type');      
      res.status(200).send(result);
    } catch (error) {
      next(new ErrorHandler(500, error, error))
    }
  },
  fetchData: async (req, res, next) => {
    try {
      const result = await AddOn.findAvailable().populate('type');    
      res.status(200).send(result);
    } catch (error) {
      next(new ErrorHandler(500, error, error))
    }
  },

  store: async (req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(422, errors, _.map(errors.errors,(o)=>{return o.param })))
    }else{
      try {
        // const item = req.body
        const item = { keys: [], title: req.body.title, price: req.body.price, type: req.body.type}
        const data = new AddOn({ ...item });
        const result = await (await data.save()).populate('type').execPopulate();
        if (result) {
          res.status(200).send(result);
        }else{
          next(new ErrorHandler(500 , result, 'Something wrong!'))
        }
      } catch (error) {
        next(new ErrorHandler(422, error, error))
      }
    }
  },

  update: async (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(422, errors, 'Invalid value'))
    }else{
      try {
        const item = req.body
        const result = await AddOn.findOneAndUpdate(
          {  _id: req.params.id, },
          { ...item },{ new: true }
        );
        if (result) {
          res.status(200).send(result);
        }else{
          next(new ErrorHandler(404, result, 'Not found!'))
        }
      } catch (error) {
        next(new ErrorHandler(422, error, error))
      }
    }
  },

  delete: async (req, res, next) => {
    console.log(req.params)
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(404, errors, 'Not found!'))
    }else{
      try {
        const result = await AddOn.softDelete(req.params.id);   
        console.log(result)  
        if (result) {
          res.status(200).send({ status : 'Delete success' });
        }else{
          next(new ErrorHandler(404, result, 'Not found!'))
        }
      } catch (error) {
        next(new ErrorHandler(422, error, error))
      }
    }    
  },
};