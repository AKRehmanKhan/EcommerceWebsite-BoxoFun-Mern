import React, { Fragment ,useState,useEffect} from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector,useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { createOrder, clearErrors } from "../../actions/orderAction";
import {removeCart} from "../../actions/cartAction"
import { useAlert } from "react-alert";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

const ConfirmOrder = ( ) => {
  const history=useNavigate();
  const alert=useAlert();
  const dispatch = useDispatch();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  const [open, setopen] = useState(false)
 

  const subtotal = cartItems.reduce( (acc, item) => acc + item.quantity * item.price,0);

  const submitConfirmToggle=()=>
  {
    (open===true)?setopen(false):setopen(true);
  }
  

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const confimOrde = () => {

      const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: subtotal,
    taxPrice: tax,
    shippingPrice: shippingCharges,
    totalPrice: totalPrice,
    };


          dispatch(createOrder(order));
           dispatch(removeCart());
          // localStorage.removeItem("cartItems")
          history("/success");
  };


      useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch,alert, error]);

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X PKR {item.price} ={" "}
                      <b>PKR {item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>PKR {subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>PKR {shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>PKR {tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>PKR {totalPrice}</span>
            </div>

            <button onClick={submitConfirmToggle}>Confirm Order</button>
          </div>
        </div>
      </div>


        <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitConfirmToggle}
          >
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogContent className="submitDialog">
              <Typography>You are about to place an Order</Typography>
              <h4 style={{textAlign:"center",color:"tomato"}}>Are you sure?</h4>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitConfirmToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={confimOrde} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

    </Fragment>
  );
};

export default ConfirmOrder;
