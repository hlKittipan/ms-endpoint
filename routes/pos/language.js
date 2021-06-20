const languageCode = require("../../controllers/pos/language_code");
const { check } = require('express-validator');

module.exports = (server) => {
  server.get("/pos/language-code", async (req, res, next) => {
    languageCode.fetchData(req, res, next);
  });
  server.post("/pos/language-code", [check('name').exists(),check('code').exists()], async (req, res, next) => {
    languageCode.store(req, res, next);
  });
  server.put("/pos/language-code/:id", [check('id').isMongoId()], async (req, res, next) => {
    languageCode.update(req, res, next);
  });
  server.delete("/pos/language-code/:id", [check('id').isMongoId()], async (req, res, next) => {
    languageCode.delete(req, res, next);
  });
};