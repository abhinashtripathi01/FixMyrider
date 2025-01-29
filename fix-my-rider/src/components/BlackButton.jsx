import { Button, CircularProgress } from "@mui/material";
import React from "react";

const BlackButton = (
  { label, buttonStyle, onClick, disable, loading },
  ...props
) => {
  return (
    <Button
      style={{
        borderRadius: "4px",
        textTransform: "none",
        fontSize: "16px",
        backgroundColor: "#111",
        color: "#ffffff",
        ...buttonStyle,
        display: "flex",
        gap: "4px",
      }}
      onClick={onClick}
      {...props}
      disabled={disable || loading}
    >
      {label}
      {loading && <CircularProgress color="inherit" size="20px" />}
    </Button>
  );
};

export default BlackButton;
