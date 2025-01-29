import React, { useContext, useEffect, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import { Button, CircularProgress, TextField } from "@mui/material";
import mainContext from "../../context/mainContext";
import "./styles.css";
import BlackButton from "../../components/BlackButton";
import { API_URL } from "../../globalConstants";

const MechanicProfile = () => {
  const [profileImage, setProfileImage] = useState();
  const { handleAlert, fetchMechanic, mechanicData } = useContext(mainContext);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [address, setAddress] = useState();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState();

  useEffect(() => {
    if (mechanicData) {
      setName(mechanicData?.name);
      setDescription(mechanicData?.description);
      setAddress(mechanicData?.address);
      setPhone(mechanicData?.phone);
      setProfileImage(mechanicData?.image);
    } else {
      fetchMechanic();
    }
  }, [mechanicData]);

  const handleSubmit = async () => {
    if (!name || !description || !address || !phone || !profileImage) {
      handleAlert("Please do not leave any field empty", "error");
      return;
    }

    const payload = {
      name,
      image: profileImage,
      description,
      address,
      phone,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/mechanic/update/${mechanicData?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data?.success) {
        handleAlert(data.message, "success");
        fetchMechanic();
      } else {
        handleAlert("Server Error", "error");
      }

      // Refresh mechanic data after a successful update
    } catch (err) {
      handleAlert(err.message || "Failed to update mechanic", "error");
    }
  };

  return (
    <div className="admin-container">
      <div className="title">Mechanic Profile</div>
      {name ? (
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

export default MechanicProfile;
