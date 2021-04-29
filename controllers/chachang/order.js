const { DateTime } = require("luxon");
const axios = require("axios");
const _ = require("lodash");
const order = require("../../models/chachang/orders");
const orderDetail = require("../../models/chachang/order_details");
const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../../helpers/error')

module.exports = {
  index: async (req, res, next) => {
    try {
      const result = await order.findById(req.params.id).populate("order_detail");
      res.status(200).send(result);
    } catch (error) {
      next(new ErrorHandler(500, error, error))
    }
  },
  fetchData: async (req, res, next) => {
    try {
      const result = await order.findAvailable().populate("order_detail");      
      res.status(200).send(result);
    } catch (error) {
      next(new ErrorHandler(500, error, error))
    }
  },

  store: async (req, res, next) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(422, errors, errors))
    }
    try {
      const item = req.body
      const dataOrder = new order({
        ...item,
        status: 'Done',
      });
      const resultOrder = await dataOrder.save();
      try {
        const returnDataOrder = await insertOrderDetail(req.body.order_details, resultOrder)
        if (result) {
          res.status(200).send(returnDataOrder);
        }else{
          next(new ErrorHandler(500 , returnDataOrder, 'Something wrong!'))
        }
      } catch (error) {
        next(new ErrorHandler(422, error, error))
      }
    } catch (error) {
      next(new ErrorHandler(422, error, error))
    }
  },

  update: async (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    const { qty = 0, sub_total = 0.0,discount_per = 0 ,discount_number = 0 ,discount_note = null ,total = 0.0 } = req.body
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      next(new ErrorHandler(422, errors, 'Invalid value'))
    }
    try {
      const result = await order.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          sub_total,
          discount_per,
          discount_number,
          discount_note,
          total,     
        },{ new: true }
      );
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
      const result = await order.softDelete(req.params.id);
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


async function insertOrderDetail(arrayOrderDetail,resultOrder) { 
  const product = [] , payment= [] 
  const arrayData = arrayOrderDetail.map((item) => {
    return {
      ...item,
      product,
      payment,
      order: [resultOrder._id],
      status: 'Done',
    }
  })
  try {
    const resultOrderDetail = await orderDetail.insertMany(arrayData,{populate : ['order','payment','product'] })
    await order.findOneAndUpdate({ _id: resultOrder._id },{order_detail:resultOrderDetail},{ new: true })
    return resultOrderDetail
    // return await orderDetail.find({order: resultOrder._id}).populate("order").populate("payment").populate("product").exec();
  } catch (error) {
    throw new ErrorHandler(500, error, error)
  } 
}