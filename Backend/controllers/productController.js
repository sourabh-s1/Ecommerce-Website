const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

router.get('/', async (req, res) => {
	try {
		const products = await Product.find().lean().exec();

		return res.status(200).send(products);
	} catch (err) {
		console.log(err);
	}
})


router.get('/:id', async (req, res) => {
	try{
		let product = await Product.findById(req.params.id).lean().exec();

		if(!product){
			return res.status(500).json({success: false, message: 'Product not found'})
		}

		return res.status(200).json({success: true, product})

	} catch (err) {
		console.log(err);
	}
})

router.post('/new', async (req, res, next) => {
	try {
		const product = await Product.create(req.body);

		return res.status(201).json({
			success: true,
			product
		});
	} catch (err) {
		console.log(err);
	}
})

router.put('/:id', async (req, res,next) => {
	try {
		let product = await Product.findById(req.params.id)

		if(!product) {
			return res.status(500).json({success: false, message: 'Product not found'})
		}

		product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true, useFindAndModify: false});

		return res.status(200).json({success: true, product})
	} catch (err) {
		console.log(err);
	}
})

router.delete('/:id', async (req, res, next) => {
	try{
		let product = await Product.findById(req.params.id);

		if(!product) {
			return res.status(500).json({success: false, message: 'Product not found'})
		}

		product = await Product.findByIdAndDelete(req.params.id).lean().exec();

		return res.status(200).json({success: true, message: 'Product deleted successfully!'})
	} catch (err) {
		console.log(err);
	}
})

module.exports = router
