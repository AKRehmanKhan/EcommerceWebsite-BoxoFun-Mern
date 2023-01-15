import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:boxofun.getitfirst@gmail.com">
        <Button>Contact: boxofun.getitfirst@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
