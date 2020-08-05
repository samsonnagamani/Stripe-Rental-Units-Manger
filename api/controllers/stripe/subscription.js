// Environment variables
require('dotenv').config();

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);
const CustomerController = require('./customer');

module.exports.addSubscription = async (req, res) => {
  const { email, room } = req.body;

  // Retrieve customer from email
  const customer = await CustomerController.getOneFromEmail(email);

  stripe.subscriptions.create(
    {
      customer: customer.id,
      items: [
        { price: 'price_1H0DPRB33Q8kDXJoDtad9pSd' },
      ],
    },
    (err, subscription) => {
      if (err) return res.status(err.statusCode).json({ error: err });

      return res.status(201).json({ subscription });
    },
  );
};

module.exports.updateSubscription = (req, res) => {

};

module.exports.cancelSubscription = (req, res) => {

};
