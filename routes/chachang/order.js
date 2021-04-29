const Order = require("../../controllers/chachang/order");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/Order-detail/:id", [check('id').isMongoId()], async (req, res, next) => {
    Order.index(req, res, next);
  });  
  server.get("/chachang/Order", async (req, res, next) => {
    Order.fetchData(req, res, next);
  });  
  server.post("/chachang/Order", async (req, res, next) => {
    Order.store(req, res, next);
  });  
  server.put("/chachang/Order/:id", [check('id').isMongoId()], async (req, res, next) => {
    Order.update(req, res, next);
  });  
  server.delete("/chachang/Order/:id", [check('id').isMongoId()], async (req, res, next) => {
    Order.delete(req, res, next);
  });  
};