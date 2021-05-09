const Product = require("../../controllers/chachang/product");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/product/new", async (req, res, next) => {
    Product.index(req, res, next);
  });
  server.get("/chachang/product", async (req, res, next) => {
    Product.fetchData(req, res, next);
  });
  server.post("/chachang/product", [check('title').exists()], async (req, res, next) => {
    Product.store(req, res, next);
  });
  server.put("/chachang/product/:id", [check('id').isMongoId()], async (req, res, next) => {
    Product.update(req, res, next);
  });
  server.delete("/chachang/product/:id", [check('id').isMongoId()], async (req, res, next) => {
    Product.delete(req, res, next);
  });
};