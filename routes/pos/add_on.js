const AddOn = require("../../controllers/pos/add_on");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/add-on/new", async (req, res, next) => {
    AddOn.index(req, res, next);
  });
  server.get("/pos/add-on", async (req, res, next) => {
    AddOn.fetchData(req, res, next);
  });
  server.post("/pos/add-on", [check('title').exists()], async (req, res, next) => {
    AddOn.store(req, res, next);
  });
  server.put("/pos/add-on/:id", [check('id').isMongoId()], async (req, res, next) => {
    AddOn.update(req, res, next);
  });
  server.delete("/pos/add-on/:id", [check('id').isMongoId()], async (req, res, next) => {
    AddOn.delete(req, res, next);
  });
  server.get("/pos/add-on-list", async (req, res, next) => {
    AddOn.addOnToOrder(req, res, next);
  });
};