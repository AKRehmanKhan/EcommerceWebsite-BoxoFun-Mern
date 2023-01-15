
import "./App.css";
import { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";
import NavigateHome from "./component/layout/NavigateHome/NavHome.js"
import FoogotTokenSucc from "./component/User/FoogotTokenSucc"
import Radium, { StyleRoot } from 'radium';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
        
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
    <StyleRoot>
      <Header />


      {isAuthenticated && <UserOptions user={user} />}

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}


      <Routes>
        
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/product/:id" element={<ProductDetails/>} />
        <Route exact path="/products" element={<Products/>} />
        <Route path="/products/:keyword" element={<Products/>} />

        <Route exact path="/search" element={<Search/>} />

        <Route exact path="/contact" element={<Contact/>} />

        <Route exact path="/about" element={<About/>} />

        {/* <ProtectedRoute exact path="/account" element={Profile} /> */}
        <Route exact path="/account" element={(isAuthenticated===true)?<Profile/>:<Navigate to="/login"/>}/>

        {/* <ProtectedRoute exact path="/me/update" element={UpdateProfile} /> */}
         <Route exact path="/me/update" element={(isAuthenticated===true)?<UpdateProfile/>:<Navigate to="/login"/>}/>

        <Route exact path="/password/update" element={(isAuthenticated===true)?<UpdatePassword/>:<Navigate to="/login"/>}/>
        

        <Route exact path="/password/forgot" element={<ForgotPassword/>} />
        <Route exact path ="Password/Recovery/Link/Sent" element={<FoogotTokenSucc/> } />

        <Route exact path="/password/reset/:token" element={<ResetPassword/>} />

        <Route exact path="/login" element={<LoginSignUp/>} />

        <Route exact path="/cart" element={<Cart/>} />

        {/* <ProtectedRoute exact path="/shipping" element={Shipping} /> */}
        <Route exact  path="/shipping" element={(isAuthenticated===true)?<Shipping/>:<Navigate to="/login"/>}/>

        <Route exact  path="/success"element={(isAuthenticated===true)?<OrderSuccess/>:<Navigate to="/login"/>}/>

        <Route exact path="/orders"  element={(isAuthenticated===true)?<MyOrders/>:<Navigate to="/login"/>}/>

        <Route exact path="/order/confirm"element={(isAuthenticated===true)?<ConfirmOrder/>:<Navigate to="/login"/>}/>

        <Route exact path="/order/:id" element={(isAuthenticated===true)?<OrderDetails/>:<Navigate to="/login"/>}/>

        <Route exact  path="/admin/dashboard" element={(isAuthenticated===true && user.role==="admin")?<Dashboard/>:<Navigate to="/login"/>}/>
       
        <Route exact  path="/admin/products" element={(isAuthenticated===true && user.role==="admin")?<ProductList/>:<Navigate to="/login"/>}/>
       
        <Route exact   path="/admin/product" element={(isAuthenticated===true && user.role==="admin")?<NewProduct/>:<Navigate to="/login"/>}/>

        <Route exact  path="/admin/product/:id" element={(isAuthenticated===true && user.role==="admin")?<UpdateProduct/>:<Navigate to="/login"/>}/>
        <Route exact path="/admin/orders" element={(isAuthenticated===true && user.role==="admin")?<OrderList/>:<Navigate to="/login"/>}/>

        <Route exact   path="/admin/order/:id" element={(isAuthenticated===true && user.role==="admin")?<ProcessOrder/>:<Navigate to="/login"/>}/>
        <Route exact  path="/admin/users" element={(isAuthenticated===true && user.role==="admin")?<UsersList/>:<Navigate to="/login"/>}/>

        <Route exact path="/admin/user/:id" element={(isAuthenticated===true && user.role==="admin")?<UpdateUser/>:<Navigate to="/login"/>}/>

        <Route exact path="/admin/reviews" element={(isAuthenticated===true && user.role==="admin")?<ProductReviews/>:<Navigate to="/login"/>}/>

        <Route
          element={
            window.location.pathname === "/process/payment" ? null : <NotFound/>
          }
        /> 
      </Routes>
            <NavigateHome/>
      <Footer />
      </StyleRoot>
    </Router>
  );
}

export default Radium(App);
