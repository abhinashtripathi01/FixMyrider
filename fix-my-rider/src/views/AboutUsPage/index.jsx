import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import { TextField } from "@mui/material";
import BlackButton from "../../components/BlackButton";
import { API_URL } from "../../globalConstants";
import mainContext from "../../context/mainContext";

const AboutUsPage = () => {
  const context = useContext(mainContext);
  const { handleAlert } = context;

  return (
    <div className="about-us-container">
      <div className="left-side">
        <div className="left-side-content">
          FixMyRider <p>Find a Mechanic Near You Anytime, Anywhere</p>
        </div>
      </div>
      <div className="right-side">
        <div className="right-form">
          <div className="top-text">WHAT WE DO?</div>
          <div className="bottom-text">About FixMyRider</div>
          <p style={{ fontSize: "18px", fontWeight: "400" }}>
            FixMyRider is your go-to solution for seamless vehicle repairs and
            maintenance. Our platform connects you with trusted mechanics,
            ensuring your ride stays in top condition. With FixMyRider, you can
            effortlessly schedule repairs, track progress, and access expert
            services—all tailored to suit your needs. We’re dedicated to keeping
            you on the move with reliability and ease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
