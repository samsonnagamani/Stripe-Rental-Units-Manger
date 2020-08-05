// Environment variables
require('dotenv').config();

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);
const TenantController = require('../tenant');

module.exports.createOne = (req, res) => {
  // Destruct request body
  const { name, email, phone, line1, towncity, county, postcode } = req.body;

  // Checks if customer already exists in stripe backend
  stripe.customers.list(
    { email },
    (listError, customers) => {
      if (listError) return res.status(listError.statusCode).json({ error: listError });

      // Returns if there are duplicate customers in stripe backend
      if (customers.data.length > 1) return res.status(500).json({ error: 'Duplicate customer in stripe' });

      // Returns if customer already exists in stripe backend
      if (customers.data.length === 1) return res.status(500).json({ error: 'Customer already exists in stripe' });

      return stripe.customers.create(
        {
          name,
          email,
          phone,
          address: {
            line1,
            city: towncity,
            postal_code: postcode,
            state: county,
          },
        },
        (createError, customer) => {
          if (createError) return res.status(createError.statusCode).json({ error: createError });

          return res.status(201).json({
            tenant: 'Tenant created',
            customer,
          });
        },
      );
    },
  );
};

module.exports.getAll = async () => new Promise((resolve, reject) => {
  stripe.customers.list((err, customers) => {
    if (err) {
      reject(err);
    }

    resolve(customers.data);
  });
});

module.exports.getOne = (req, res) => {
  const customerId = req.params.id;

  stripe.customers.retrieve(
    customerId,
    (err, customer) => {
      if (err) {
        // err.statusCode comes from the stripe response
        return res.status(err.statusCode).json({
          error: err,
        });
      }

      return res.status(200).json({
        customer,
      });
    },
  );
};

module.exports.deleteOne = (req, res) => {
  const customerId = req.params.id;

  stripe.customers.del(
    customerId,
    (err, confirmation) => {
      if (err.statusCode) {
        return res.status(404).json({ error: err });
      }

      return res.status(200).json({ confirmation });
    },
  );
};

module.exports.updateOneBase = (req, res, next) => {
  // Updates local database
  TenantController.updateOne(req, res, next);

  const customerId = req.params.id;
  // Destruct request body
  const { name, email, phone, line1, towncity, county, postcode } = req.body;

  // Updates customer on stripe
  stripe.customers.update(
    customerId,
    {
      name,
      email,
      phone,
      address: {
        line1,
        city: towncity,
        state: county,
        postal_code: postcode,
      },
    },
    (err, customer) => {
      if (err) {
        return res.status(err.statusCode).json({ error: err });
      }

      return res.status(200).json({ customer });
    },
  );
};

module.exports.getOneFromEmail = async (email) => new Promise((resolve, reject) => {
  stripe.customers.list(
    { email },
    (err, customers) => {
      if (err) reject(err);
      if (customers.data.length > 1) reject(new Error('There are duplicate customers'));
      if (customers.data.length === 0) reject(new Error('Customer does not exist'));
      if (customers.data.length === 1) {
        const [data] = customers.data;
        resolve(data);
      }
    },
  );
});

module.exports.createPortalSession = async (req, res) => {
  const { email } = req.body;

  this.getOneFromEmail(email)
    .then(async (customer) => {
      const session = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: process.env.STRIPE_RETURN_URL,
      });

      console.log(session);

     return res.status(200).json({ session });
    })
    .catch((err) => console.log(err));
};
