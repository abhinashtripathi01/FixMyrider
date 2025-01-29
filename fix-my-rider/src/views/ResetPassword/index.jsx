import React, { useContext, useState } from "react";
import "./style.css";
import { TextField } from "@mui/material";
import BlackButton from "../../components/BlackButton";
import mainContext from "../../context/mainContext";
import { API_URL } from "../../globalConstants";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const context = useContext(mainContext);
  const { handleAlert, navigate } = context;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/user/reset-password?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

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
          <div className="bottom-text">Reset Password</div>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New password"
            type="password"
            id="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <BlackButton
            label="Submit"
            buttonStyle={{ width: "100%", marginTop: "20px" }}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
