const paymentType = require("../../controllers/chachang/payment_type");

module.exports = (server) => {
  server.get("/chachang/payment-type", async (req, res, next) => {
    paymentType.fetchData(req, res, next);
  });  
  server.post("/chachang/payment-type", async (req, res, next) => {
    paymentType.store(req, res, next);
  });  
  server.put("/chachang/payment-type/:id", async (req, res, next) => {
    paymentType.update(req, res, next);
  });  
  server.delete("/chachang/payment-type/:id", async (req, res, next) => {
    paymentType.delete(req, res, next);
  });  
};