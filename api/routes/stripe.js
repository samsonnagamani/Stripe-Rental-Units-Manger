const { Router } = require('express');
const CustomerController = require('../controllers/stripe/customer');
const TenantController = require('../controllers/tenant');
const SubscriptionController = require('../controllers/stripe/subscription');

const router = Router();

router.get('/customer', async (req, res) => {
  return CustomerController.getAll().then((customers) => res.status(200).json({ customers }));
  // Checks if data request failed
  // if (data.statusCode !== 200) {
  //   return res.status(data.statusCode).json({ err: data });
  // }

  // return res.status(data.statusCode).json({ customers: data.statusCode });
});
router.get('/customer/:id', CustomerController.getOne);
router.post('/customer', TenantController.createOne, CustomerController.createOne);
router.delete('/customer/:id', CustomerController.deleteOne);

router.post('/customer/portal', CustomerController.createPortalSession);


// router.post('/customer/subscription/add', SubscriptionController.addSubscription);

module.exports = router;
