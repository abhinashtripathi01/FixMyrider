import React, { useRef, useState } from "react";
import { Avatar, Typography, CardMedia, CircularProgress } from "@mui/material";
import { Stack, Box } from "@mui/system";
import { UploadIcon } from "../assets/icons";
const DocumentUpload = (props) => {
  const [image, setImage] = useState("");
  const { url, setUrl } = props;
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    setUrl(undefined);
    const file = e.target.files[0];
    const data = new FormData();
    setLoading(true);
    data.append("file", file);
    data.append("upload_preset", "khajahuntuploads");
    data.append("cloud_name", "paradise007");
    fetch("https://api.cloudinary.com/v1_1/paradise007/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUrl(data.url); // update the url state here
        setLoading(false);
      })
      .catch((err) => console.log(err));
    setImage(file);
  };

  const handleDivClick = () => {
    fileInputRef.current.click(); // Trigger click on file input when div is clicked
  };
  return (
    <>
      {!url ? (
        <div
          style={{
            width: "240px",
            height: "116px",
            border: "1px dashed #3B3BFF",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#3B3BFF",
            fontWeight: "600",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleDivClick}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <UploadIcon />
              Browse file to upload
            </>
          )}
        </div>
      ) : (
        <img
          src={url}
          alt="image"
          style={{
            width: "240px",
            height: "116px",
            objectFit: "cover",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={handleDivClick}
        />
      )}
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
    </>
  );
};
export default DocumentUpload;
