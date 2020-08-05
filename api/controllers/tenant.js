const Tenant = require('../models/Tenant');
const Address = require('../models/Address');

module.exports.createOne = (req, res, next) => {
  // Destruct request body
  const { name, email, phone, roomNumbers, line1, towncity, county, postcode } = req.body;

  // Returns a single document from unique email
  return Tenant.findOne({ email })
    .exec()
    .then((tenant) => {
      if (!tenant) {
        // Creates new Address Object for Tenant
        const address = new Address({
          line1,
          towncity,
          county,
          postcode,
        });

        // Creates new Tenant Object
        const newTenant = new Tenant({
          name,
          email,
          phone,
          roomNumbers,
          address,
        });

        // Saves tenant object to database
        newTenant
          .save()
          .then(() => next())
          .catch((saveError) => res.status(500).json({ error: saveError }));
      } else {
        // Runs if account already exits
        return res.status(409).json({
          message: 'Tenant already exists',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports.deleteOne = (req, res) => {
  return Tenant.deleteOne({ _id: req.params.id })
    .exec()
    .then((tenant) => res.status(200).json({
      tenant,
    }))
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.updateOne = (req, res) => {
  const { name, email, phone, roomNumbers, line1, towncity, county, postcode } = req.body;

  const update = {
    name,
    email,
    phone,
    roomNumbers,
    line1,
    towncity,
    county,
    postcode,
  };

  return Tenant.findOneAndUpdate({ _id: req.params.id }, update, { returnOriginal: false })
    .exec()
    .then((err, tenant) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      return tenant;
    })
    .catch((err) => res.json({ error: err }));
};

module.exports.getAll = (req, res) => {
  return Tenant.find({})
    .exec()
    .then((tenants) => {
      console.log(tenants);
      res.status(200).json({tenants})

    })
    .catch((err) => res.status(500).json({ error: err }));
};

module.exports.getOne = (req, res) => {
  const { id } = req.params;

  return Tenant.findOne({ _id: id })
    .exec()
    .then((tenant) => res.status(200).json({ tenant }))
    .catch((err) => res.status(500).json({ error: err }));
};
