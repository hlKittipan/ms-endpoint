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
        
      );
    }
  });

  // add customers
  server.post('/customers', async (req, res, next) => {
    if (!req.is("application/json")) {
      
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
      
    }
  });

  // update customer
  server.put("/customers/:id",  async (req, res, next) => {
    if (!req.is("application/json")) {
      
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
      
    }
  });

  // Delete customer
  server.delete("/customers/:id",   async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndDelete({ _id: req.params.id });
      res.send(204);
      next();
    } catch (err) {
      
    }
  });
};
