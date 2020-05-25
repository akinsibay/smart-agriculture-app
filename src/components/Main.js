import React from "react";
import logo from "../assets/apralogo.jpg";
import Footer from "./Footer";
const Main = () => {
  const imgStyle = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "30vh",
  };

  const textStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div>
      <img src={logo} alt="alt" class="center" style={imgStyle} />
      <h1 style={textStyle}>TARIM UYGULAMASI</h1>

      <Footer />
    </div>
  );
};

export default Main;
