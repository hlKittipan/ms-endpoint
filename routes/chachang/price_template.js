const priceTemplate = require("../../controllers/chachang/price_template");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/price-template", async (req, res, next) => {
    priceTemplate.fetchData(req, res, next);
  });
  server.post("/chachang/price-template", [check('name').exists()], async (req, res, next) => {
    priceTemplate.store(req, res, next);
  });
  server.put("/chachang/price-template/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceTemplate.update(req, res, next);
  });
  server.delete("/chachang/price-template/:id", [check('id').isMongoId()], async (req, res, next) => {
    priceTemplate.delete(req, res, next);
  });
};