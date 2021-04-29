const priceType = require("../../controllers/chachang/price_type");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/price-type", async (req, res, next) => {
    priceType.fetchData(req, res, next);
  });
  server.post("/chachang/price-type", [check('name').exists()], async (req, res, next) => {
    priceType.store(req, res, next);
  });
  server.put("/chachang/price-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceType.update(req, res, next);
  });
  server.delete("/chachang/price-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceType.delete(req, res, next);
  });
};