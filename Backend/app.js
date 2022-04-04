const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const orderController = require('./controllers/orderController');

const errorMiddleware = require('./middlewares/error');


app.use(express.json());
app.use(cookieParser());

app.use('/products', productController);
app.use('/user',userController);
app.use('/order', orderController);

app.use(errorMiddleware);


module.exports = app