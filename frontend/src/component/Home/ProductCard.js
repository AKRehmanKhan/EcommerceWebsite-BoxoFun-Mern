import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import  Radium, {StyleRoot} from "radium"

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
    size:"small"
  };

  const style=
  {
      marginLeft: "0.5vmax",
      marginTop:"0.3vmax",
      font: "300 0.7vmax Roboto",
      color:(product.Stock<1)?"tomato":"green", 
        
      '@media (max-width: 600px)': {
    marginLeft: "0.5vmax",
    marginTop:"0.3vmax",
    fontSize:"0.9vmax"
      
        }
  }


  return (
    <StyleRoot>
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <div>
       <p>{product.name}</p>
       <span style={style}>{(product.Stock<1)?"OutOfStock":"InStock"}</span>
       </div>
      <div className="red">
        <Rating {...options} />{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`PKR ${product.price}`}</span>
    </Link>
    </StyleRoot>
  );
};

export default Radium(ProductCard);
