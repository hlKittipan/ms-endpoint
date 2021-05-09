const languageCode = require("../../controllers/chachang/language_code");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/chachang/language-code", async (req, res, next) => {
    languageCode.fetchData(req, res, next);
  });
  server.post("/chachang/language-code", [check('name').exists()], async (req, res, next) => {
    languageCode.store(req, res, next);
  });
  server.put("/chachang/language-code/:id", [check('id').isMongoId()], async (req, res, next) => {
    languageCode.update(req, res, next);
  });
  server.delete("/chachang/language-code/:id", [check('id').isMongoId()], async (req, res, next) => {
    languageCode.delete(req, res, next);
  });
};