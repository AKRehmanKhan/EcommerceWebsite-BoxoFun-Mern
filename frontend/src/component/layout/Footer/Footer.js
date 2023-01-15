import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD APP 4</h4>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>BoxoFun</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2022 &copy; Abdul Rehman Khan</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us On</h4>
        <a href="https://www.linkedin.com/in/abdulrehman-khan-98a97021b" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://www.facebook.com/profile.php?id=100021092663177" target="_blank" rel="noreferrer">Facebook</a>        
        <a href="https://www.instagram.com/a.khan7533" target="_blank" rel="noreferrer">Instragram</a>
      </div>
    </footer>
  );
};

export default Footer;
