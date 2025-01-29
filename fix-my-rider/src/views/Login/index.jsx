import React, { useContext, useState } from "react";
import "./style.css";
import { TextField } from "@mui/material";
import BlackButton from "../../components/BlackButton";
import mainContext from "../../context/mainContext";
import { API_URL } from "../../globalConstants";

const Login = () => {
  const context = useContext(mainContext);
  const { handleAlert, navigate } = context;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchUserData } = useContext(mainContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.user) {
      localStorage.setItem("token", data.user);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      handleAlert("Login successful", "success");
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
      fetchUserData();
    } else {
      handleAlert(data.message, "error");
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
          <div className="top-text">WELCOME BACK</div>
          <div className="bottom-text">Log In to your Account</div>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            label="Login"
            buttonStyle={{ width: "100%", marginTop: "20px" }}
            onClick={handleSubmit}
          />
          <div className="link-text">
            Do not have an account? <a href="/signup">SIGN UP HERE</a>
          </div>

          <div className="link-text">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
