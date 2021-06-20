const priceTemplate = require("../../controllers/pos/price_template");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/price-template", async (req, res, next) => {
    priceTemplate.fetchData(req, res, next);
  });
  server.post("/pos/price-template", [check('name').exists()], async (req, res, next) => {
    priceTemplate.store(req, res, next);
  });
  server.put("/pos/price-template/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceTemplate.update(req, res, next);
  });
  server.delete("/pos/price-template/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceTemplate.delete(req, res, next);
  });
};