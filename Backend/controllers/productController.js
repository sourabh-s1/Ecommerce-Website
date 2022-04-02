const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const ErrorHandler=require('../utils/errorhandler');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
	try {
		const products = await Product.find().lean().exec();

		return res.status(200).send(products);
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})


router.post('/new', async (req, res, next) => {
	try {
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

router.put('/:id', async (req, res,next) => {
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

router.delete('/:id', async (req, res, next) => {
	try{
		let product = await Product.findById(req.params.id);

		product = await Product.findByIdAndDelete(req.params.id).lean().exec();

		return res.status(200).json({success: true, message: 'Product deleted successfully!'})
	} catch (err) {
		return next(new ErrorHandler(err,404));
	}
})

module.exports = router
