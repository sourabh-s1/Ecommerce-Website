import React from 'react'
import {CgMouse} from 'react-icons/cg'
import {useEffect,useState} from 'react'
import './Home.css'
import Product from './Product.jsx'

const product = {
  name: 'Blue Shirt',
  images: [{url: 'https://i.ibb.co/DRST11n/1.webp'}],
  price: "$3000",
  _id: 'product-1',
}

function Home() {

  return <>
    <div className="banner" data-aos="zoom-out" data-aos-duration="2000">
      <h1>Welcome to ShoppersSpot</h1>
      <p>Find amazing products below</p>

      <a href="#container">
        <button >
          Scroll <CgMouse/>
        </button>
      </a>
    </div>

    <h2 className="homeHeading">Featured Products</h2>

    <div className="container" id="container">
      <Product product={product}/>
    </div>
  </>
}

export default Home