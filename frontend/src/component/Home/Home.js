import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import Carousel from "react-material-ui-carousel";
import im1 from "../../images/img.jpg"
import im2 from "../../images/loewe-technology-MOC4wqaasE8-unsplash.jpg"
import im3 from "../../images/cover.jfif"
//import im5 from "../../images/simon-hrozian-uNC9-RgzjTA-unsplash.jpg"
import im6 from "../../images/imgg.jpg"

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  const images=["https://res.cloudinary.com/dzeorw06z/image/upload/v1672322290/avatars/simon-hrozian-uNC9-RgzjTA-unsplash_d3tqdw.jpg",im2,im1,im6,im3]
 

  useEffect(() => {
    window.scrollTo(0, 0);
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="BoxoFun" />


          <Carousel
          indicators={true}
          >  

              {images.map((item, i) => (
                    <img
                      className="img"
                      key={i}
                      src={item}
                      alt={`${i} Slide`}  
                    />
                     ))}
             </Carousel>

            <div className="banner">
              <p>Welcome to BoxoFun</p>
              <h1>FIND AMAZING PRODUCTS BELOW</h1>

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
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
