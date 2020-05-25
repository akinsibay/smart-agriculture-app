import React from "react";

const Footer = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor:'black'
      }}
    >
      
      <h4>
        <p style={{float:'left',opacity:'0.5',color:'white',fontFamily:'Century Gothic'}}>
          Copyright © {new Date().getFullYear()} APRA Mühendislik & Danışmanlık. All Rights Reserved.
        </p>{" "}   
        {/* eslint-disable-next-line */} 
        <a href="https://www.apradanismanlik.com" target="_blank"  rel="noopener" style={{float:'right',marginRight:'20px',fontFamily:'Century Gothic'}}>www.apradanismanlik.com</a>  
        
               
      </h4>
    </div>
  );
};

export default Footer;
