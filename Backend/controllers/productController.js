const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const User = require('../models/userModel');
const ErrorHandler=require('../utils/errorhandler');
const mongoose = require('mongoose');
const ApiFeatures=require('../utils/apiFeatures');
const {isAuthenticatedUser,authorizedRoles} = require('../middlewares/auth')

router.get('/',isAuthenticatedUser, async (req, res , next) => {
	try {
		const resultPerPage = 8;
		const productsCount = await Product.countDocuments();
		const ApiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
		const products = await ApiFeature.query;

		return res.status(200).json({success: true, products, productsCount});
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})


router.post('/admin/new',isAuthenticatedUser, authorizedRoles("admin"), async (req, res, next) => {
	try {
		req.body.user = req.user.id;

		const product = await Product.create(req.body);

		if(!product){
			return next(new ErrorHandler(err,404));
		}

		return res.status(201).json({
			success: true,
			product
		});
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})

router.get('/:id', async (req, res, next) => {
	try{
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return next(new ErrorHandler("Product not found",404));
		}
		let product = await Product.findById(req.params.id);

		if(!product){
			return next(new ErrorHandler("Product not found",404));
		}

		return res.status(200).json({success: true, product})

	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})

router.put('/admin/:id',isAuthenticatedUser, authorizedRoles("admin"), async (req, res,next) => {
	try {
		//if(!mongoose.Types.ObjectId.isValid(req.params.id)){
		//	return next(new ErrorHandler("Product not found",404));
		//}

		let product = await Product.findById(req.params.id)

		product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true, useFindAndModify: false});

		return res.status(200).json({success: true, product})
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})

router.delete('/admin/:id',isAuthenticatedUser, authorizedRoles("admin"), async (req, res, next) => {
	try{
		let product = await Product.findById(req.params.id);

		product = await Product.findByIdAndDelete(req.params.id).lean().exec();

		return res.status(200).json({success: true, message: 'Product deleted successfully!'})
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})

//Review Routes
//Get All reviews
router.get('/reviews/:id', async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);

		if(!product) {
			return next(new ErrorHandler("Product Not Found",404));
		}

		res.status(200).json({
			success: true,
			reviews: product.reviews
		})
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})
//Product Add / Update Review Routes
router.put('/review', isAuthenticatedUser, async (req, res, next) => {
	try {

	const {rating,comment,productId} = req.body

	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	}

	const product = await Product.findById(productId);

	//Checking if user already gave the review to that product
	const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

	if(isReviewed){
		product.reviews.forEach((rev) => {
			//iterating over array of reviews and finding the one that matches and editing it
			if(rev.user.toString() === req.user._id.toString()){
				(rev.rating = rating),
				(rev.comment = comment)
			}
		})
	} else {

		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}


	//Average rating
	let avg = 0;
	product.reviews.forEach(rev => {
		avg+=rev.rating
	})

	product.ratings = avg / product.reviews.length;

	await product.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
	})
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})

router.delete('/review', isAuthenticatedUser, async (req, res, next) => {
	try {
		const product = await Product.findById(req.query.productId);
		if(!product){
			return next(new ErrorHandler("Review not found",404))
		}

		const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

		let avg = 0;
		reviews.forEach(rev => {
		avg+=rev.rating
		})

		const ratings = avg / reviews.length;
		const numOfReviews = reviews.length;

		await Product.findByIdAndUpdate(req.query.productId, {
			reviews,
			ratings,
			numOfReviews
		},{
			new: true,
			runValidators: true,
			useFindAndModify: false
		})

		res.status(200).json({
			success: true,
		})
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})

module.exports = router
