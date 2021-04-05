const Menu = require("../../controllers/chachang/menu");

module.exports = (server) => {
  server.get("/chachang/fetchdata", async (req, res, next) => {
    Menu.fetchData(req, res, next);
  });  
  server.post("/chachang/menu", async (req, res, next) => {
    Menu.store(req, res, next);
  });  
  server.put("/chachang/menu/:id", async (req, res, next) => {
    Menu.update(req, res, next);
  });  
  server.delete("/chachang/menu/:id", async (req, res, next) => {
    Menu.delete(req, res, next);
  });  
};