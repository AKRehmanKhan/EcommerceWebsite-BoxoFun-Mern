const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel")
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;


  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  });

  if(order)
  {
        const user = await User.findById(req.user.id);
         const message = `<html>
                    <head>
                        <title>Order Placed</title>
                    </head>
                    <body>
                            
          <div style="background-color: white">
            <div style="  padding: 5vmax; padding-bottom: 0%">
              <p style=" font: 300 3vmax Roboto;margin: 4vmax 0;color: tomato">
                Order #${order && order._id}
              </p>
              <p style="  font: 400 1.8vmax Roboto">Shipping Info</p>
              <div style="margin: 2vmax">
                <div style="  display: flex; margin: 1.2vmax 0">
                  <p style="  margin: 0 1.2vmax; font: 400 1.2vmax Roboto;">Name:</p>
                  <span style="  margin: 0 1.2vmax;  font: 100 1.2vmax Roboto;  color: #575757;">${user && user.name}</span>
                </div>
                <div style="  display: flex; margin: 1.2vmax 0">
                  <p style=" margin: 0 1.2vmax;  font: 400 1.2vmax Roboto;">Phone:</p>
                  <span style="  margin: 0 1.2vmax;  font: 100 1.2vmax Roboto;  color: #575757;">
                    ${order.shippingInfo && order.shippingInfo.phoneNo}
                  </span>
                </div>
                <div style="  display: flex; margin: 1.2vmax 0">
                  <p style=" margin: 0 1.2vmax;  font: 400 1.2vmax Roboto;">Address:</p>
                  <span style="  margin: 0 1.2vmax;  font: 100 1.2vmax Roboto;  color: #575757;">
                    ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}
                  </span>
                </div>
              </div>

              <p style="font: 400 1.8vmax Roboto">Payment</p>
              <div style="margin: 2vmax">
              <div style="display: flex;  margin: 1.2vmax 0">
                  <p
                    style="color:${(order.orderStatus === "succeeded")
                        ? `green`
                        : "red"
                    };   font: 400 1.2vmax Roboto"
                  >
                    ${order.orderStatus &&
                    order.orderStatus === "Delivered"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>

                <div style="  display: flex; margin: 1.2vmax 0">
                   <p style=" margin: 0 1.2vmax; font: 400 1.2vmax Roboto"s>Amount:</p>
                  <span style="  margin: 0 1.2vmax; font: 100 1.2vmax Roboto; color: #575757">PKR ${order.totalPrice && order.totalPrice}</span>
                </div>
              </div>

              <p style="font: 400 1.8vmax Roboto">Order Status</p>
              <div style="margin: 2vmax">
                <div style="  display: flex;  margin: 1.2vmax 0">
                  <p
                    style="color:${(order.orderStatus === "Delivered")
                        ? "green"
                        : "red"
                    };   font: 400 1.2vmax Roboto"
                  >
                    ${order.orderStatus && order.orderStatus}
                  </p>
                </div>
              </div>
            </div>

            <div style=" padding: 2vmax 5vmax;  border-top: 1px solid rgba(0, 0, 0, 0.164)">
              <p style=" font: 400 1.8vmax Roboto">Order Items:</p>
              <div style="margin:2vmax">
                ${order.orderItems &&
                  order.orderItems.map((item) => (
                    `<div  style="display: flex; font: 400 1.2vmax Roboto; align-items: center; margin: 2vmax 0" key=${item.product}>
                      <img style="width: 3vmax" src=${item.image} alt="Product" />
                      <a  style="color: #575757; margin: 0 2vmax; width: 60%; text-decoration: underline" href="http://localhost:3000/product/${item.product}">
                        ${item.name}
                      </a>
                      <span style="  font: 100 1.2vmax Roboto; color: #5e5e5e">
                        ${item.quantity} X PKR ${item.price} =
                        <b>PKR ${item.price * item.quantity}</b>
                      </span>
                    </div>`
                  ))}
              </div>
            </div>
          </div>

                    </body>
                    </html>`

  

      await sendEmail({
      email: user.email,
      subject: "Boxo Fun Order Placed",
      message
    });
      
    res.status(201).json({
      success: true,
      order,
    });
  }
  else
    res.status(401).json({
    success: false,
  });

});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  const user = await User.findById(req.user.id);
  let message;

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
          });
      message=
      `<html>

<head>
    <title>Order Placed</title>
</head>

<body style="justify-content:center;align-items:center">
    <h3 style="color:tomato; text-align:center">BoxoFun</h5>
        <h5 style="color:gray; text-align:center">Your Order <a href= "http://localhost:3000/order/${order._id}" style=" font-weight: bold; font-family: 'Times New Roman', serif;color:tomato; text-decoration: underline;">#ID ${order._id}</a> has been shipped</h5>
         <br><br>
            <div style=" padding: 2vmax 5vmax;  border-top: 1px solid rgba(0, 0, 0, 0.164)">
            <p style="font: 400 1.5vmax Roboto">Order Items</p>
            <div style="margin:2vmax">
                ${order.orderItems &&
                  order.orderItems.map((item) => (
                `<div style="display: flex; font: 400 1.2vmax Roboto; align-items: center; margin: 2vmax 0" key=${item.product}>
                    <img style="width: 3vmax" src=${item.image} alt="Product" />
                    <a style="color: #575757; margin: 0 2vmax; width: 60%; text-decoration: underline"
                        href="http://localhost:3000/order/${item.product}">
                        ${item.name}
                    </a>
                    <span style="  font: 100 1.2vmax Roboto; color: #5e5e5e">
                        ${item.quantity} X PKR ${item.price} =
                        <b>PKR ${item.price * item.quantity}</b>
                    </span>
                </div>`
                  ))}
            </div>
        </div>
</body>

</html>`

  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
          message=
      `<html>

<head>
    <title>Order Placed</title>
</head>

<body style="justify-content:center;align-items:center">
    <h3 style="color:tomato; text-align:center">BoxoFun</h5>
        <h5 style="color:gray; text-align:center">Your Order <a href= "http://localhost:3000/order/${order._id}" style=" font-weight: bold; font-family: 'Times New Roman', serif;color:tomato; text-decoration: underline;">#ID ${order._id}</a> has been delivered</h5>
         <br><br>
            <div style=" padding: 2vmax 5vmax;  border-top: 1px solid rgba(0, 0, 0, 0.164)">
            <p style=" font: 400 1.5vmax Roboto">Order Items</p>
            <div style="margin:2vmax">
                ${order.orderItems &&
                  order.orderItems.map((item) => (
                `<div style="display: flex; font: 400 1.2vmax Roboto; align-items: center; margin: 2vmax 0" key=${item.product}>
                    <img style="width: 3vmax" src=${item.image} alt="Product" />
                    <a style="color: #575757; margin: 0 2vmax; width: 60%; text-decoration: underline"
                        href="http://localhost:3000/product/${item.product}">
                        ${item.name}
                    </a>
                    <span style="  font: 100 1.2vmax Roboto; color: #5e5e5e">
                        ${item.quantity} X PKR ${item.price} =
                        <b>PKR ${item.price * item.quantity}</b>
                    </span>
                </div>`
                  ))}
            </div>
        </div>
</body>

</html>`
  }

  await sendEmail({
  email: user.email,
  subject: "Boxo Fun Order Status",
  message
  });

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
