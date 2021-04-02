const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Customer = require('../models/customer');
const config = require('../configs/index');

module.exports = (server) => {
  //get customers
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // get single customer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          "There is no customer with the id of " + req.params.id
        )
      );
    }
  });

  // add customers
  server.post('/customers', rjwt({ secret: config.JWT_SERCRET }), async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'applications/json'"));
    }

    const { name, email, balance } = req.body;

    const customer = new Customer({
      name,
      email,
      balance,
    });
    try {
      const newCustomer = await customer.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  // update customer
  server.put("/customers/:id", rjwt({ secret: config.JWT_SERCRET }), async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'applications/json"));
    }

    const { name, email, balance } = req.body;

    try {
      const customer = await Customer.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          "There is no customer with the id of " + req.params.id
        )
      );
    }
  });

  // Delete customer
  server.delete("/customers/:id",  rjwt({ secret: config.JWT_SERCRET }), async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndDelete({ _id: req.params.id });
      res.send(204);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          "There is no customer with the id of " + req.params.id
        )
      );
    }
  });
};
