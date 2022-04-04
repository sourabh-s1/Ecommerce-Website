const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const { isAuthenticatedUser , authorizedRoles} = require("../middlewares/auth");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");


//Create order
router.post("/new", isAuthenticatedUser, async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
	  paidAt: Date.now(),
	  user: req.user._id,
    });

	res.status(200).json({
		success: true,
		order,
	})
  } catch (err) {
    return next(new ErrorHandler(err, 404));
  }
});


//get logged in users orders
router.get('/me',isAuthenticatedUser, async (req, res, next) => {
	try {
		const orders = await Order.find({user: req.user._id})

		res.status(200).json({
			success: true,
			orders,
		})
	} catch (err) {
		return next(new ErrorHandler(err, 404));
	}
})


//Get all users orders -- Admin
router.get('/admin',isAuthenticatedUser, authorizedRoles("admin"), async (req, res, next) => {
	try {
		const orders = await Order.find()

		let totalAmount = 0;
		orders.forEach((order) => totalAmount += order.amount);

		res.status(200).json({
			success: true,
			orders,
			totalAmount
		})
	} catch (err) {
		return next(new ErrorHandler(err, 404));
	}
})


//Update order status -- Admin
router.put('/update/:id',isAuthenticatedUser, authorizedRoles("admin"), async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id);

		if(!order){
			return next(new ErrorHandler(`Order not found with id ${req.params.id}`,404));
		}

		if(order.orderStatus === "Delivered"){
			return next(new ErrorHandler("You have already delivered this order",400))
		}

		order.orderItems.forEach(async (e) => {
			await updateStock(e.product, e.quantity)
		})

		order.orderStatus = req.body.status;

		if(req.body.status === "Delivered"){
			order.deliveredAt = Date.now();
		}

		await order.save({ validateBeforeSave: false});
		res.status(200).json({
			success: true,
		})
	} catch (err) {
		return next(new ErrorHandler(err, 404));
	}
})

//This function is to change stock in product db
async function updateStock(id,quantity){
	const product = await Product.findById(id);
	product.stock-=quantity;
	await product.save({ validateBeforeSave: false});
}


//Delete order -- Admin
router.delete('/update/:id',isAuthenticatedUser, authorizedRoles("admin"), async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id);

		if(!order){
			return next(new ErrorHandler(`Order not found with id ${req.params.id}`,404));
		}

		await order.remove();

		res.status(200).json({
			success: true,
		})
	} catch (err) {
		return next(new ErrorHandler(err, 404));
	}
})


//Get order details by id
router.get('/admin/:id',isAuthenticatedUser, async (req, res, next) => {
	try {
		const orders = await Order.findById(req.params.id).populate("user","name email");

		if(!orders){
			return next(new ErrorHandler("Orders not found",404));
		}

		res.status(200).json({
			success: true,
			orders,
		})
	} catch (err) {
		return next(new ErrorHandler(err, 404));
	}
})

module.exports = router;