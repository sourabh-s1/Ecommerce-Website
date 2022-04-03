const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: {type: String, required: [true, 'Please provide product name']},
		discription: {
			type: String,
			required: [true, 'Please provide product description']
		},
		price: {
			type: Number,
			required: [true, 'Please provide product price'],
			maxLength: [5, 'Product price above limit']
		},
		rating: {
			type: Number,
			default:0,
		},
		images: [
			{
			public_id: {type: String, required: true},
			url: {type: String, required: true}
			}
		],
		category: {
			type: String,
			required: [true, 'Please provide product category'],
		},
		stock: {
			type: Number,
			required: [true, 'Please provide product stock'],
			max_value:[15,"Stock should be less than or equal to 15"],
			default: 1
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		reviews: [
			{
				name: {
					type: String,
					required: true,
				},
				rating: {
					type: Number,
					required: true,
				},
				comment: {
					type: String,
					required: false,
				}
			}
		],
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		created_at: {
			type: Date,
			default: Date.now
		}
	}
)

module.exports = mongoose.model('Product', productSchema);