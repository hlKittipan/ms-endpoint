const menuType = require("../../controllers/chachang/menu_type");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/menu-type", async (req, res, next) => {
    menuType.fetchData(req, res, next);
  });
  server.post("/chachang/menu-type", [check('name').exists()], async (req, res, next) => {
    menuType.store(req, res, next);
  });
  server.put("/chachang/menu-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    menuType.update(req, res, next);
  });
  server.delete("/chachang/menu-type/:id", [check('id').isMongoId()], async (req, res, next) => {
    menuType.delete(req, res, next);
  });
};