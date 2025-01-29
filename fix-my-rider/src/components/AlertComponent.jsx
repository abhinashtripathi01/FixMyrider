import React, { useContext } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import mainContext from "../context/mainContext";

const AlertComponent = () => {
  const context = useContext(mainContext);
  const { alert, open, handleClose } = context;

  const vertical = "top";
  const horizontal = "center";
  return (
    <>
      {alert && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {alert.msg}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default AlertComponent;
