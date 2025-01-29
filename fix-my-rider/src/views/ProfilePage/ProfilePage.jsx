import React, { useContext, useEffect, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import { CircularProgress, TextField } from "@mui/material";
import mainContext from "../../context/mainContext";
import "./styles.css";
import BlackButton from "../../components/BlackButton";
import { API_URL } from "../../globalConstants";

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState();
  const { userData, fetchUserData, handleAlert, fetchMechanic, mechanicData } =
    useContext(mainContext);
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const token = localStorage.getItem("token");
  const [phone, setPhone] = useState();

  useEffect(() => {
    if (userData) {
      setName(userData?.username);
      setAddress(userData?.address);
      setPhone(userData?.phone);
      setProfileImage(userData?.image);
    } else {
      fetchUserData();
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (!name || !address || !phone) {
      handleAlert("Please do not leave required fields empty", "error");
      return;
    }

    const payload = {
      username: name,
      address,
      phone,
      image: profileImage,
    };

    try {
      const response = await fetch(`${API_URL}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data?.success) {
        handleAlert(data.message, "success");
        fetchUserData();
      } else {
        handleAlert("Server Error", "error");
      }

      // Refresh mechanic data after a successful update
    } catch (err) {
      handleAlert("Failed to update profile", "error");
    }
  };

  return (
    <div className="admin-container">
      <div className="title">Profile</div>
      {name ? (
        <div className="form">
          <div className="profile-picture">
            Profile Picture
            <ImageUpload url={profileImage} setUrl={setProfileImage} />
          </div>
          <div className="center">
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              fullWidth
              value={name}
              defaultValue={name}
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
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="number"
            />

            <BlackButton
              variant="contained"
              size="large"
              onClick={() => handleSubmit()}
              label="Update"
              buttonStyle={{
                marginLeft: "auto",
                width: "124px",
                marginTop: "20px",
              }}
            />
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default ProfilePage;
