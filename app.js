const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');

mongoose.connect(
  'mongodb+srv://devesh_524:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0-nfdwp.mongodb.net/test?retryWrites=true&w=majority',
  // {
  //   useMongoClient: true
  // }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'PUT',
      'POST',
      'DELETE',
      'PATCH',
      'GET'
    );
    return res.status(200).json({});
  }
  next();
});

app.use('/orders', orderRoutes);
app.use('/products', productRoutes);

//Catching Errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
