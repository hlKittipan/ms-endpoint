const Menu = require("../../controllers/chachang/menu");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/menu/new", async (req, res, next) => {
    Menu.index(req, res, next);
  });
  server.get("/chachang/menu", async (req, res, next) => {
    Menu.fetchData(req, res, next);
  });
  server.post("/chachang/menu", [check('title').exists()], async (req, res, next) => {
    Menu.store(req, res, next);
  });
  server.put("/chachang/menu/:id", [check('id').isMongoId()], async (req, res, next) => {
    Menu.update(req, res, next);
  });
  server.delete("/chachang/menu/:id", [check('id').isMongoId()], async (req, res, next) => {
    Menu.delete(req, res, next);
  });
};