const Order = require("../../controllers/pos/order");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/Order-detail/:id", [check('id').isMongoId()], async (req, res, next) => {
    Order.index(req, res, next);
  });  
  server.get("/pos/Order", async (req, res, next) => {
    Order.fetchData(req, res, next);
  });  
  server.post("/pos/Order", async (req, res, next) => {
    Order.store(req, res, next);
  });  
  server.put("/pos/Order/:id", [check('id').isMongoId()], async (req, res, next) => {
    Order.update(req, res, next);
  });  
  server.delete("/pos/Order/:id", [check('id').isMongoId()], async (req, res, next) => {
    Order.delete(req, res, next);
  });  
};