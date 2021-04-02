const Menu = require("../../controllers/chachang/menu");

module.exports = (server) => {
  server.get("/chachang/fetchdata", async (req, res, next) => {
    Menu.fetchData(req, res, next);
  });  
  server.get("/chachang/menu/store", async (req, res, next) => {
    Menu.store(req, res, next);
  });  
};