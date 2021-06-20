const priceType = require("../../controllers/pos/price_type");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/price-type", async (req, res, next) => {
    priceType.fetchData(req, res, next);
  });
  server.post("/pos/price-type", [check('name').exists()], async (req, res, next) => {
    priceType.store(req, res, next);
  });
  server.put("/pos/price-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceType.update(req, res, next);
  });
  server.delete("/pos/price-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceType.delete(req, res, next);
  });
};