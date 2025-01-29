import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ListCard from "./ListCard";
import { useContext } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import mainContext from "../../context/mainContext";
import { BlackLocationIcon } from "../../assets/icons";
import { API_URL } from "../../globalConstants";

const theme = createTheme({
  palette: {
    primary: {
      main: "#574b90",
    },
  },
});
const List = () => {
  const context = useContext(mainContext);
  const { lat, lng, setMechanics, mechanics } = context;

  const fetchNearbyMechanic = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/mechanic/fetch/nearby?latitude=${lat}&longitude=${lng}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch mechanics nearby");
      }

      const data = await response.json();
      const fdata = await data.filter((item) => {
        return item.isBlocked !== true;
      });
      await setMechanics(fdata);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (lat) {
      fetchNearbyMechanic();
    }
  }, [lat, lng]);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography
          style={{
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
          align="left"
        >
          <BlackLocationIcon /> Mechanic Nearby
        </Typography>

        <div
          style={{
            marginTop: "20px",
            height: "80vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {mechanics?.length >= 0 &&
            mechanics.map((data) => {
              return (
                <>
                  <ListCard data={data} />
                </>
              );
            })}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default List;
