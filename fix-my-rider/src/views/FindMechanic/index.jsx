import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import List from "../../components/List";
import Maps from "../../components/Map";
import mainContext from "../../context/mainContext";

const FindMechanic = () => {
  const { userData, navigate } = useContext(mainContext);
  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData]);
  return (
    <Grid container spacing={2} style={{ width: "100%", padding: "30px 6%" }}>
      <Grid item xs={12} md={4}>
        <List />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Maps />
      </Grid>
    </Grid>
  );
};

export default FindMechanic;
