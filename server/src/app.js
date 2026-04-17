const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parse json request body
app.use(express.json());
// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Enable cors
app.use(cors());
app.options(/.*/, cors());

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use(notFoundHandler);

// handle error
app.use(errorHandler);

module.exports = app;
