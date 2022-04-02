const express = require('express');
const app = express();
const productController = require('./controllers/productController');
const errorMiddleware = require('./middlewares/error');

app.use(express.json())

app.use('/products',productController);
app.use(errorMiddleware);


module.exports = app