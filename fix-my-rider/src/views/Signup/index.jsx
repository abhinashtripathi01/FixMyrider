import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import { TextField } from "@mui/material";
import BlackButton from "../../components/BlackButton";
import { API_URL } from "../../globalConstants";
import mainContext from "../../context/mainContext";

const SignUp = () => {
  const context = useContext(mainContext);
  const { handleAlert, navigate, userData } = context;
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (userData) {
      navigate("/signup");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: fname,
        email,
        phone,
        password,
        address,
        phone,
      }),
    });
    const data = await response.json();

    if (data.message) {
      handleAlert(data.message, "info");
      navigate("/login");
    } else {
      handleAlert("User Cannot be Created", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="left-side-content">
          FixMyRider <p>Find a Mechanic Near You Anytime, Anywhere</p>
        </div>
      </div>
      <div className="right-side">
        <div className="right-form">
          <div className="top-text">LET'S GET YOU STARTED</div>
          <div className="bottom-text">Create an Account</div>
          <TextField
            autoFocus
            margin="normal"
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="Full Name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <BlackButton
            onClick={handleSubmit}
            label="Login"
            buttonStyle={{ width: "100%", marginTop: "20px" }}
          />
          <div className="link-text">
            Already have an account ? <a href="/login">LOGIN HERE</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
