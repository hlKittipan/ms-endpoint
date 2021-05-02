const { DateTime } = require("luxon");
const _ = require("lodash");
const Menu = require("../../models/chachang/menus");
const priceType = require("../../models/chachang/price_types");
const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../../helpers/error')

module.exports = {
  index: async (req, res, next) => {},
  fetchData: async (req, res, next) => {
    try {
      const result = await Menu.findAvailable();
      const resultPriceType = await priceType.findAvailable();    
      if (result){
        for (const key in result) {
          if(result[key].category.length > 0){
            result[key].populate({ path: 'category', select: 'name' })
            console.log(result[key])
          }
          result[key] = await addMapPrice(result[key],resultPriceType) 
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
        const data = new Menu({ ...item });
        const result = await (await data.save()).populate('menutype');
        if (result) {
          const resultPriceType = await priceType.findAvailable();  
          const menu = await addMapPrice(result,resultPriceType) 
          res.status(200).send(menu);
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
        const result = await Menu.findOneAndUpdate(
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
        const result = await Menu.softDelete(req.params.id);   
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
  }
};

async function addMapPrice(data,priceType) {
  if (data.price) {

    let cacheData = data.price

    let mapPrice = _.map(priceType,function(value, key) {

      // find menu has price by price type
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