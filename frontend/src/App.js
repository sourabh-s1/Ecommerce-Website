import "./App.css";
import React from "react";
import Header from "./components/layouts/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import WebFont from "webfontloader";
import Footer from "./components/layouts/Footer/Footer";
import Home from "./components/Home/Home";
import ProductDetails from "./components/Products/ProductDetails";


function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka", "Poppins"],
      },
    });
  }, []);

  return (
    <BrowserRouter>
      <React.Fragment>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/products/:id" element={<ProductDetails />} />
        </Routes>
        <Footer />
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
