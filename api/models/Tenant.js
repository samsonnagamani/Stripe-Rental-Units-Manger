const mongoose = require('mongoose');

const { Schema } = mongoose;

const { addressSchema } = require('./Address');

const tenantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  phone: {
    type: String,
    required: true,

  },
  roomNumbers: {
    type: Array,
    required: true,
  },
  address: {
    type: addressSchema,
    required: true,
  },

}, {
  // Mongoose will create a "createdAt" and "updatedAt" properties to schema 😀
  timestamps: true,
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
