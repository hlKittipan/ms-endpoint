const productType = require("../../controllers/chachang/product_type");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/product-type", async (req, res, next) => {
    productType.fetchData(req, res, next);
  });
  server.post("/chachang/product-type", [check('name').exists()], async (req, res, next) => {
    productType.store(req, res, next);
  });
  server.put("/chachang/product-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    productType.update(req, res, next);
  });
  server.delete("/chachang/product-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    productType.delete(req, res, next);
  });
};