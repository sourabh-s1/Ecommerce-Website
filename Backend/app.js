const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const orderController = require('./controllers/orderController');

const errorMiddleware = require('./middlewares/error');


app.use(express.json());
app.use(cookieParser());

app.use('/api/products', productController);
app.use('/api/user',userController);
app.use('/api/order', orderController);

app.use(errorMiddleware);


module.exports = app