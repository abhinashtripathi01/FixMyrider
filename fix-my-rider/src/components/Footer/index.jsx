import React, { useEffect } from "react";
import "./styles.css";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <>
      <div
        className={`footer-container ${path !== "/" && "dark"}`}
        style={{
          background: path !== "/" ? "#333333" : "",
          color: path !== "/" ? "#ffffff" : "",
        }}
      >
        <div className="footer-content-container">
          <div className="footer-content">
            FixMyRider <p>Find a Mechanic Near You Anytime, Anywhere</p>
          </div>
          <div className="footer-content column">
            <div>
              Pages
              <p>
                <a>Home</a>
              </p>
              <p>
                <a>About</a>
              </p>
            </div>

            <div>
              Access
              <p>
                <a>Login</a>
              </p>
              <p>
                <a>Register</a>
              </p>
            </div>

            <div>
              Links
              <p>
                <a>Find Mechanic Nearby</a>
              </p>
              <p>
                <a>Create Mechanic Account</a>
              </p>
            </div>
          </div>
        </div>
        <hr className="footer-hr"></hr>
        <div className="copyright">
          Copyright © {new Date().getFullYear()} FixMyRider. All rights reserved
        </div>
      </div>
    </>
  );
};

export default Footer;
