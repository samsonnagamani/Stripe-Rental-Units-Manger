const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./middleware');
const adminRoutes = require('./api/routes/admin');
const tenantRoutes = require('./api/routes/tenant');
const stripeRoutes = require('./api/routes/stripe');

// Environment variables
require('dotenv').config();

// Init. Express app
const app = express();

// Check for local or remote db connection
const DATABASE_URL = process.env.LOCAL_DATABASE_URL || process.env.REMOTE_DATABASE_URL;

mongoose.connect(process.env.REMOTE_DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/api/admin', adminRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/stripe', stripeRoutes);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
