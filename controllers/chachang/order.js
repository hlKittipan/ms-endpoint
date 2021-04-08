const { DateTime } = require("luxon");
const axios = require("axios");
const _ = require("lodash");
const order = require("../../models/chachang/orders");
const orderDetail = require("../../models/chachang/order_details");

module.exports = {
  index: async (req, res, next) => {},
  fetchData: async (req, res, next) => {
    try {
      const result = await order.findAvailable().populate("order_detail");
      res.status(200).send(result);
      next();
    } catch (error) {
      next(error);
    }
  },

  store: async (req, res, next) => {
    try {
      const item = req.body
      const dataOrder = new order({
        ...item,
        status: 'Done',
      });
      const resultOrder = await dataOrder.save();
      try {
        const returnDataOrder = await insertOrderDetail(req.body.order_details, resultOrder)
        res.status(200).send(returnDataOrder);
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    const { qty = 0, sub_total = 0.0,discount_per = 0 ,discount_number = 0 ,discount_note = null ,total = 0.0 } = req.body
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
      res.status(200).send(result);
      next();
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    console.log(req.params)
    try {
      const result = await order.softDelete(req.params.id);
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
    throw new Error(error)
  } 
}