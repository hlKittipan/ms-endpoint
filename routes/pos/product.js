const Product = require("../../controllers/pos/product");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/product/new", async (req, res, next) => {
    Product.index(req, res, next);
  });
  server.get("/pos/product", async (req, res, next) => {
    Product.fetchData(req, res, next);
  });
  server.post("/pos/product", [check('title').exists()], async (req, res, next) => {
    Product.store(req, res, next);
  });
  server.put("/pos/product/:id", [check('id').isMongoId()], async (req, res, next) => {
    Product.update(req, res, next);
  });
  server.delete("/pos/product/:id", [check('id').isMongoId()], async (req, res, next) => {
    Product.delete(req, res, next);
  });
};