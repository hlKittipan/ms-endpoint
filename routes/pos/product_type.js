const productType = require("../../controllers/pos/product_type");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/product-type", async (req, res, next) => {
    productType.fetchData(req, res, next);
  });
  server.post("/pos/product-type", [check('name').exists()], async (req, res, next) => {
    productType.store(req, res, next);
  });
  server.put("/pos/product-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    productType.update(req, res, next);
  });
  server.delete("/pos/product-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    productType.delete(req, res, next);
  });
};