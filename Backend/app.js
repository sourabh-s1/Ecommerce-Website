const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController')
const errorMiddleware = require('./middlewares/error');


app.use(express.json());
app.use(cookieParser());

app.use('/products', productController);
app.use('/user',userController);

app.use(errorMiddleware);


module.exports = app