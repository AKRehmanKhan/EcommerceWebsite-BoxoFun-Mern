import React from "react";
import "./ForgotTokenSucc.css";
import { Typography } from "@material-ui/core";
import chekinbox from "../../images/checkinbox.gif";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();
  return (
    <div className="RC">

      <div>
      <img src={chekinbox} alt="check inbox"/>
      <h1>Password Recovery Link Sent </h1> 
      </div>
      
     <Typography>
      <b> {'>'} </b> Password Recovery Link has been sent to your Email address<br/>
      <b> {'>'} </b> That link is valid for the next 10 minutes.<br/>
      <b> {'>'} </b> If you don't receive an email within 10 minutes, check your spam folder first and then try again.<br/>
      <b> {'>'} </b> If you did find it in your spam folder, we recommend adding 'boxofun.getitfirst@gmail.com' to your trusted sender list.<br/>
      <b> {'>'} </b> If you are still having trouble, please contact us.<br/>
     </Typography>

    <div> <button className="btnn" onClick={()=>{navigate("/password/forgot")}}>Retry</button></div>

    </div>
  );
};

export default OrderSuccess;