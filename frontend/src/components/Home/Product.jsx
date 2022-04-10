import React from 'react'
import {Link} from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'


function Product({product}) {
	const options = {
		edit: false,
		color: "rgba(20,20,20,0.1)",
		activateColor: "tomato",
		value: product.ratings,
		isHalf: true,
		size: window.innerWidth < 600 ? 20 : 25,
	}
  return (
	  <div data-aos="fade-up"
	  data-aos-duration="500">
		<Link className="productCard" to={`/products/${product._id}`} >
		<img src={product.images[0].url} alt="productImg" />
		<p>{product.name}</p>
		<div>
			<ReactStars {...options} /><span>{`(${product.numOfReviews} Reviews)`}</span>
		</div>
		<span>{`Rs.${product.price}`}</span>
		</Link>
	</div>
  )
}

export default Product