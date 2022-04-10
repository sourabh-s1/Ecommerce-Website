import React, { Fragment } from "react";
import { CgMouse } from "react-icons/cg";
import { useEffect, useState } from "react";
import "./Home.css";
import Product from "./Product.jsx";
import MetaData from "../layouts/MetaData";
import { getProducts, clearErrors } from "../../redux/actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../layouts/Loading/Loading";
import { useAlert } from "react-alert";

function Home() {

  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  console.log(products);
  useEffect(() => {

    if(error){
      return alert.error(error);
    }

    dispatch(getProducts());
  }, [dispatch, error , alert]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title="ShoppersSpot" />

          <div className="banner" data-aos="zoom-out" data-aos-duration="2000">
            <h1>Welcome to ShoppersSpot</h1>
            <p style={{ marginBottom: "1vmax", fontFamily: "poppins" }}>
              Find amazing products below
            </p>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default Home;
