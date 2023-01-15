import React, { Fragment, useRef, useState, useEffect} from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register,verifyEmail,verifyEmailCode ,ResetSend,ResetVerify} from "../../actions/userAction";
import { useAlert } from "react-alert";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import loader from "../../images/loader.png";

const LoginSignUp = () => {


  const dispatch = useDispatch();
  
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  
  const { error:errorr, message ,send , loading:sendEmLoading} = useSelector(
    (state) => state.emailVerification 
  );

   const { error: er,verified, loading:VerifyEmailLoading} = useSelector(
    (state) => state.emailVerificationCode 
  );

  const [evcodebtnvisiblity, setevcodebtnvisiblity] = useState(true);
  const [tickvisibility, settickvisibility] = useState(true);
  const [evcodeinputvisibility, setevcodeinputvisibility] = useState(false);
  const [registerbtnvisibility, setregisterbtnvisibility] = useState(false);
  const [clearsend, setclearsend] = useState(false);
  const [clearverified, setclearverified] = useState(false);


  const [visible, setvisible] = useState(false)
  const history=useNavigate();
  const alert = useAlert();
  const [sec, setsec] = useState(0);
  const [min, setmin] = useState(1);
  const ref=useRef(null);
  
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [evCode, setevcode] = useState("");
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = (e) =>
  {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit =(e) => 
  {
    e.preventDefault();

    setevcodebtnvisiblity(true);
    setevcodeinputvisibility(false);

    
    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    dispatch(register(myForm));
    setmin(1);
    setsec(0);

  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const saveevcodechange=(e)=>
  {
    setevcode({...evCode,[e.target.name]: e.target.value });
  }

  const [searchParams] = useSearchParams(); 
  const redirect = searchParams.get("redirect") ? `/${searchParams.get("redirect")}`: "/account";



  useEffect(() => {

        let timer=0;

      if (isAuthenticated) {
      history(redirect);
      dispatch(ResetSend());
      dispatch(ResetVerify());
    }  

    if(errorr)
    {
      alert.error(errorr); 
      dispatch(clearErrors());
      setevcodebtnvisiblity(true);
      setevcodeinputvisibility(false);
      setregisterbtnvisibility(false);
    }

    if(er)
    {
     alert.error(er);
     dispatch(clearErrors());
     settickvisibility(true);
     setevcodebtnvisiblity(false);
     setevcodeinputvisibility(true);
     setregisterbtnvisibility(false);

    };

    if(error==="Internal Server Error")
    {
      alert.error("Please select Image"); 
      dispatch(clearErrors());
      setevcodebtnvisiblity(false);
      setevcodeinputvisibility(false);
      setregisterbtnvisibility(true);

    }

    else if(error==="Could not decode base64"){
      alert.error("Img Upload Error: File Size Exceeds");
      dispatch(clearErrors());
      setregisterbtnvisibility(true);
      setevcodebtnvisiblity(false);
      setevcodeinputvisibility(false);
      
      
    }
    else if(error==="Invalid email or password")
    {
      alert.error(error);
      dispatch(clearErrors());
    }

    if((send || verified) && email==="")
    {
      setDefault();
      return ()=>
      {
         clearTimeout(timer);
      };
    }

    if(send && !clearsend)
    {
      alert.success("Verificattion Code Sent In Email"); 
     
      setevcodebtnvisiblity(false);
      setevcodeinputvisibility(true);
      setregisterbtnvisibility(false);
      setclearsend(true);
      setsec(0);
      setmin(1);
    };

    if(verified && !clearverified){
      alert.success("Email Verified");
      setevcodebtnvisiblity(false);
      setevcodeinputvisibility(false);
      setregisterbtnvisibility(true);
      setclearverified(true);
    };  




    if(evcodeinputvisibility && !verified && !sendEmLoading)
    {      
      timer=setTimeout(() =>
      {
       if(sec ===0 && min>0)
       {
        setsec(59);
        setmin(min-1);

       }
       else if(sec>0)
       {
        setsec(sec-1);
        }
      },(( min===0 && sec===0 ) || verified) ?null: 1000);    
      

    }

   if ( min===0 && sec===0 ) 
    {
      dispatch(ResetSend());
      dispatch(ResetVerify());      
      setevcodebtnvisiblity(true);
      setregisterbtnvisibility(false);
      setsec(0);
      setmin(1);
      setevcodeinputvisibility(false);
    }
    
    return () => {
      clearTimeout(timer);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error,errorr, er,send,alert,history,message,verified,evcodebtnvisiblity,min,sec, isAuthenticated, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };
  
  const toggleView =(event)=>
  {
    event.preventDefault();
    (visible)?setvisible(false):setvisible(true);
  }

  const VerifyEmail = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    
    if(user.email==="" )
    {
      alert.error("Please Enter Email");
      return;
    }
    
    else if(!user.email.includes('@')) 
    {
      alert.error("Emial Format is incorrect");
      return;
    }
    setevcodebtnvisiblity(false);
    setevcodeinputvisibility(true);
    setregisterbtnvisibility(false);
    myForm.set("email", user.email);

    dispatch(verifyEmail(myForm));

  };
  

  const verifyCode=(e)=>
  {
    e.preventDefault();
    if(evCode==="")
    {
     return alert.error("Please Provide Verification Code");
    }
    dispatch(verifyEmailCode(evCode));
    settickvisibility(false);

  }

  const setDefault = () => {
       dispatch(ResetSend());
       dispatch(ResetVerify()); 
       setevcodebtnvisiblity(true); 
       settickvisibility(true);
       setevcodeinputvisibility(false);
       setregisterbtnvisibility(false);
       setclearsend(false);
       setclearverified(false);    
       setmin(1);
       setsec(0);
    };



  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer" ref={ref}>
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                     type={(!visible)?"password":"input"}
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button onClick={toggleView} style={{cursor:"pointer",position:"absolute",right:'0.5vmax',border:"none",background:"none",color:(visible)?"tomato":""}}>
                   {(!visible)?  <VisibilityIcon />: <VisibilityOffIcon /> }  
                  </button>   
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>

                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                    disabled={(sendEmLoading || send)?true:false}
                  />
                   {(sendEmLoading || send) && <NotInterestedIcon className="locked" />}
                </div>

                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type={(!visible)?"password":"input"}
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                    minLength={8}
                    maxLength={20}
                  />
                  
                <button onClick={toggleView} style={{cursor:"pointer",position:"absolute",right:'0.5vmax',border:"none",background:"none",color:(visible)?"tomato":"rgba(0, 0, 0, 0.623)"}}>
                  {(!visible)?  <VisibilityIcon />: <VisibilityOffIcon /> }  
               </button>   
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>

                {evcodebtnvisiblity && !verified && <button className="verifyemail" onClick={VerifyEmail}> Get Verification Code</button>}
                
                {evcodeinputvisibility && !verified && !sendEmLoading &&
                 <div>
                    <input name="evCode" type="text" maxLength={6} onChange={saveevcodechange} placeholder="Enter Verification Code"/>     
                    { tickvisibility && (!VerifyEmailLoading)? <button className="verifycode" onClick={verifyCode} ><VerifiedUserIcon/></button>: <img className="load" src={loader} alt="" /> } 
                    <h4 className="time">{min}:{sec}</h4>  
                  </div>  
                }
                { sendEmLoading && <img src={loader} alt="" />}
                   
                {registerbtnvisibility && <input type="submit" value="Register" className="signUpBtn" />}
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
