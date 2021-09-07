const { DateTime } = require("luxon");
const _ = require("lodash");
const Product = require("../../models/pos/products");
const priceType = require("../../models/pos/price_types");
const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../../helpers/error')

module.exports = {
  index: async (req, res, next) => {
    try {
      const result = await Product.find().populate('type');
      const resultPriceType = await priceType.findAvailable();    
      if (result){
        for (const key in result) {  
          result[key] = await productMapPrice(result[key],resultPriceType) 
        }
      }            
      res.status(200).send(result);
    } catch (error) {
      next(new ErrorHandler(500, error, error))
    }
  },
  fetchData: async (req, res, next) => {
    try {
      const result = await Product.findAvailable().populate('type');
      const resultPriceType = await priceType.findAvailable();    
      if (result){
        for (const key in result) {          
          result[key] = await productMapPrice(result[key],resultPriceType) 
        }
      }            
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
        const item = req.body
        const data = new Product({ ...item });
        const result = await (await data.save()).populate('type').execPopulate();
        if (result) {
          const resultPriceType = await priceType.findAvailable();  
          const Product = await productMapPrice(result,resultPriceType) 
          res.status(200).send(Product);
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
        const result = await Product.findOneAndUpdate(
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
        const result = await Product.softDelete(req.params.id);   
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

  productToOrder: async (req, res, next) => {
    const data = await productTypeMapProduct()
    res.status(200).send(data);
  }
};

async function productMapPrice(data,priceType) {
  if (data.price) {

    let cacheData = data.price

    let mapPrice = _.map(priceType,function(value, key) {

      // find Product has price by price type
      let keyData = _.findIndex(cacheData, function(o) { 
        return o._id !== undefined ? o._id.toString() === value._id.toString() : -1; 
      });  

      if (keyData>-1){
        return {price: cacheData[keyData].price, ...value.toObject()};
      }else{                
        return {price: 0.0, ...value.toObject()};
      }      

    });

    data.price = mapPrice
    return data
  }else{
    data.price = _.map(priceType,(value, key) => {
      return {price: 0.0, ...value.toObject()}
    });
  }
}

async function productTypeMapProduct () {
  let cacheData = {}
  const result = await Product.findAvailable().populate('type');
  const resultPriceType = await priceType.findAvailable();    
  if (result){
    for (const key in result) {          
      result[key] = await productMapPrice(result[key],resultPriceType) 
      if (result[key].type) {
        if (_.has(cacheData, result[key].type._id)) {
            cacheData[result[key].type._id].product.push(result[key])
        } else {
          cacheData[result[key].type._id].productType = result[key].type.name
          cacheData[result[key].type._id].product = []
          cacheData[result[key].type._id].product.push(result[key])
        }
      }
    }   
  }   
  return cacheData
}