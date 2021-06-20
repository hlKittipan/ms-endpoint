const paymentType = require("../../controllers/pos/payment_type");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/payment-type", async (req, res, next) => {
    paymentType.fetchData(req, res, next);
  });  
  server.post("/pos/payment-type",[check('name').exists()], async (req, res, next) => {
    paymentType.store(req, res, next);
  });  
  server.put("/pos/payment-type/:id",[check('id').isMongoId()], async (req, res, next) => {
    paymentType.update(req, res, next);
  });  
  server.delete("/pos/payment-type/:id",[check('id').isMongoId()], async (req, res, next) => {
    paymentType.delete(req, res, next);
  });  
};