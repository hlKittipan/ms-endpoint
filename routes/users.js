const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../auth");
const config = require("../configs/index");

module.exports = (server) => {
  // Register User
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // hash password
        user.password = hash;
        // save user
        try {
          const newUser = await user.save();
          res.send();
          next();
        } catch (err) {
         
        }
      });
    });
  });

  // Auth User
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // authenicate user
      const user = await auth.authenticate(email, password);

      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SERCRET, {
        expiresIn: "15m",
      });

      const { iat, exp } = jwt.decode(token);
      // respond with token
      res.send({ iat, exp, token });

      next();
    } catch (err) {
      // User unauthorized
     
    }
  });
};
