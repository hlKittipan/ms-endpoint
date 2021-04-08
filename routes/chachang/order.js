const Order = require("../../controllers/chachang/order");

module.exports = (server) => {
  server.get("/chachang/Order-detail", async (req, res, next) => {
    Order.index(req, res, next);
  });  
  server.get("/chachang/Order", async (req, res, next) => {
    Order.fetchData(req, res, next);
  });  
  server.post("/chachang/Order", async (req, res, next) => {
    Order.store(req, res, next);
  });  
  server.put("/chachang/Order/:id", async (req, res, next) => {
    Order.update(req, res, next);
  });  
  server.delete("/chachang/Order/:id", async (req, res, next) => {
    Order.delete(req, res, next);
  });  
};