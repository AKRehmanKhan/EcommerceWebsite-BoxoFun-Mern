import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
   "Laptop",
    "DesktopPC",
    "SmartTV",
    "SmartWatch",
    "HeadPhone",
    "Camera",
    "SmartPhones",
    "EarBuds",
    "Assitant",
    "DigitalCLock"
];

categories.sort();

const Products = () => {

  const history = useNavigate();

  const {keyword} = useParams();

  const dispatch = useDispatch();

  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 10000000]);
  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    resultPerPage,
    totalfilteredproducts,
  } = useSelector((state) => state.products);


  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const clearFilters=()=>
  {
      history("/products");
      setCurrentPage(1);
      setPrice([0, 10000000]);
      setCategory("");
      setRatings(0);
  }
 

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct(keyword, currentPage, price, category, ratings));

  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  return (
    <Fragment>


    
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- BoxoFun" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

        </Fragment>
      )}


             
        <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={10000000}
            />

            <Typography>Categories</Typography>
            <ol className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ol>

       
            <div>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
             </div>

             <button onClick={clearFilters}>Clear Filters</button>
       
          </div>

            {(
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                pageRangeDisplayed={1}
                totalItemsCount={totalfilteredproducts}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
    </Fragment>
  );
};

export default Products;
