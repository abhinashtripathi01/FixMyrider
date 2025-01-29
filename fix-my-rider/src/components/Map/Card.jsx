import React, { useContext } from "react";
import { Popup } from "react-map-gl";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StarIcon } from "../../assets/icons";
import mainContext from "../../context/mainContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#574b90",
    },
  },
});

const MechanicCard = ({ data }) => {
  const context = useContext(mainContext);
  const { navigate } = context;
  const [showPopup, setShowPopup] = useState(true);
  return (
    <ThemeProvider theme={theme}>
      <Popup
        className="apple-popup"
        longitude={data.coordinates.longitude}
        latitude={data.coordinates.latitude}
        anchor="bottom"
        onClose={() => setShowPopup(false)}
        closeOnClick={false}
        maxWidth="200px"
        style={{ borderRadius: "12px", padding: "8px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/mechanic/" + data.slug)}
        >
          <img
            src={data.image}
            width="40px"
            height="40px"
            style={{
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              <StarIcon />
              {data.rating.toFixed(1)}/5
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#848484",
              }}
            >
              {data.distance.toFixed(2)} KM
            </div>
          </div>
        </div>
      </Popup>
    </ThemeProvider>
  );
};

export default MechanicCard;
