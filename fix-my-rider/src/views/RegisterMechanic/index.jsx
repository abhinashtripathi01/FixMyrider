import {
  Typography,
  Grid,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Stack,
} from "@mui/material";
import "./style.css";
import React, { useContext, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import DocumentUpload from "../../components/DocumentUpload";
import { SelectMap } from "../../components/SelectMap";
import { useNavigate } from "react-router-dom";
import BlackButton from "../../components/BlackButton";
import { API_URL } from "../../globalConstants";
import mainContext from "../../context/mainContext";

const RegisterMechanic = (props) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState();
  const { handleAlert } = useContext(mainContext);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [address, setAddress] = useState();
  const [document1, setDocument1] = useState();
  const [document2, setDocument2] = useState();
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [phone, setPhone] = useState();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mechanic-request/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          image: profileImage,
          description,
          coordinates: {
            latitude: lat,
            longitude: lng,
          },
          userId,
          document1,
          document2,
          address,
          phone,
        }),
      });
      const message = await response.json();
      handleAlert(message.message, message?.success ? "info" : "error");
      if (message?.success) {
        navigate("/");
      }
    } catch (err) {
      alert("An error Occured!", err);
      console.log("error", err);
    }
  };

  return (
    <div className="register-mechanic-container">
      <div className="title">Mechanic Registration Form</div>
      <div className="form">
        <div className="profile-picture">
          Profile Picture*
          <ImageUpload url={profileImage} setUrl={setProfileImage} />
        </div>
        <div className="center">
          <TextField
            id="outlined-basic"
            label="Full Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            id="outlined-basic"
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            type="number"
          />

          <div className="document-div">
            <div className="profile-picture">
              Citizenship/ Passport *
              <DocumentUpload url={document1} setUrl={setDocument1} />
            </div>
            <div className="profile-picture">
              Firm Document (If any Business)
              <DocumentUpload url={document2} setUrl={setDocument2} />
            </div>
          </div>
        </div>

        <div className="select-location">
          Select your exact location on the map
          <SelectMap lng={lng} lat={lat} setLng={setLng} setLat={setLat} />
        </div>
      </div>
      <p>
        This form is for mechanics and vehicle workshops to register for the
        platform. By completing this form, you will be able to create an online
        profile, showcase your services, and connect with vehicle owners who
        need immediate assistance.
        <b> After Submitting the form you will be notified through an email.</b>
      </p>
      <Stack>
        <BlackButton
          variant="contained"
          size="large"
          onClick={() => handleSubmit()}
          label="Submit"
          buttonStyle={{
            marginLeft: "auto",
            width: "124px",
            marginTop: "20px",
          }}
        />
      </Stack>
    </div>
  );
};

export default RegisterMechanic;
