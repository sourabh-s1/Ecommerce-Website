import React, {useEffect} from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { getProductDetails } from "../../redux/actions/productAction";
import { useSelector, useDispatch } from "react-redux";

const ProductDetails = (id) => {
	  const dispatch = useDispatch();
	  const {product} = useSelector((state) => state.productDetails);

	  console.log(product);
	  useEffect(() => {
		  dispatch(getProductDetails(id));
	  }, []);
  return (
    <>
      <div className="ProductDetails">
        <div>
          <Carousel>
            {product.images &&
              product.images.map((item, i) => (
                <img
                  className="CarouselImg"
                  key={item.url}
                  src={item.url}
                  alt={`${i} Slide`}
                />
              ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
