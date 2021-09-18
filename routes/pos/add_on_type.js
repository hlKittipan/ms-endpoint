const AddOnType = require("../../controllers/pos/add_on_type");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/add-on-type", async (req, res, next) => {
    AddOnType.fetchData(req, res, next);
  });
  server.post("/pos/add-on-type", [check('title').exists()], async (req, res, next) => {
    AddOnType.store(req, res, next);
  });
  server.put("/pos/add-on-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    AddOnType.update(req, res, next);
  });
  server.delete("/pos/add-on-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    AddOnType.delete(req, res, next);
  });
};