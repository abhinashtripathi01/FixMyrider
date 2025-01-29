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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data?.success) {
        handleAlert(data?.message, "success");
        navigate("/login");
      } else {
        handleAlert(data?.message, "error");
      }
    } catch (error) {
      handleAlert("Something went wrong", "error");
    }
    setLoading(false);
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
          <div className="top-text">Forgot Password?</div>
          <div className="bottom-text">Recover Account</div>
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

          <BlackButton
            label="Request Reset Link"
            buttonStyle={{ width: "100%", marginTop: "20px" }}
            onClick={handleSubmit}
            loading={loading}
          />
          <div className="link-text">
            <a href="/login">Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
