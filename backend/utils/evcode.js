const  config = require("../config/config")
const ErrorHander = require("../utils/errorhander");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

// Create Token and saving in cookie


const sendCode = async (email,message,code, res,next) => {

  try {
    await sendEmail({
      email: email,
      subject: `BoxoFun Email Veification Code`,
      message
    });
    }
    catch(error)
    {
         return next(new ErrorHander(error.message, 500));
    }

  // options for cookie

   const signetcode=jwt.sign({evcode:code}, config.JWT_SECRET, {
    expiresIn: config.CODE_COOKIE_EXPIRE,
  });

  const options = {
    expires: new Date(
      Date.now() + config.CODE_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("evcode", signetcode, options).json({
    success: true,
    message:"Verification Code Sent in Email"

  });
};

module.exports = sendCode;
