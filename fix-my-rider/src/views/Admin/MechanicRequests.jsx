import {
  Box,
  Button,
  CardMedia,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../globalConstants";
import { CloseSharp } from "@mui/icons-material";
import { EmailIcon, LocationIcon, PhoneIcon } from "../../assets/icons";
import mainContext from "../../context/mainContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

const MechanicRequestsPage = () => {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [data, setData] = useState(null);
  const { handleAlert } = useContext(mainContext);
  var token = localStorage.getItem("token");
  const fetchMechanicRequests = () => {
    fetch(`${API_URL}/api/mechanic-request/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  console.log(data, "getData");
  useEffect(() => {
    fetchMechanicRequests();
  }, []);

  const handleReject = (id) => {
    fetch(`${API_URL}/api/mechanic-request/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        handleAlert(data.message, "info");
        fetchMechanicRequests();
      })
      .catch((error) => {
        alert("Error:", error);
      });
  };

  const handleAccept = (id) => {
    fetch(`${API_URL}/api/mechanic-request/${id}/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        handleAlert(data.message, "info");
        fetchMechanicRequests();
      })
      .catch((error) => {
        alert("Error:", error);
      });
  };
  return (
    <div className="admin-container">
      <div className="title">Mechanic Requests</div>
      <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "700" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <img
                    src={row.image}
                    style={{
                      height: "30px",
                      width: "30px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  {row.name}
                </TableCell>
                <TableCell>{row?.email}</TableCell>
                <TableCell>{row?.address}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      sx={{
                        border: "1px solid #8280FF",
                        color: "#8280FF",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "12px",

                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => setOpenViewModal(row)}
                    >
                      View
                    </Button>
                    <Button
                      sx={{
                        border: "1px solid #FF6666",
                        color: "#FF6666",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "12px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => handleReject(row._id)}
                    >
                      Reject
                    </Button>
                    <Button
                      sx={{
                        border: "1px solid #43C182",
                        color: "#43C182",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "12px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => handleAccept(row._id)}
                    >
                      Accept
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Mechanic Registration Data
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setOpenViewModal(false)}
            >
              <CloseSharp />
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Stack
              direction="row"
              alignItems="start"
              spacing={2}
              justifyContent="space-between"
              flexWrap="wrap"
              gap="20px"
              height="80vh"
              overflow="auto"
            >
              <Stack direction="row" alignItems="start" spacing={2} mt={4}>
                <img
                  src={openViewModal.image}
                  width="140px"
                  height="140px"
                  style={{
                    objectFit: "cover",
                    borderRadius: "4px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ fontSize: "24px" }}>{openViewModal.name}</div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#595959",
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <EmailIcon />
                    {openViewModal.email}
                  </div>

                  <div
                    style={{
                      fontSize: "16px",
                      color: "#595959",
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <PhoneIcon />
                    {openViewModal.phone}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#595959",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <LocationIcon />
                    {openViewModal.address}
                  </div>
                </div>
              </Stack>
              <Stack sx={{ margin: "24px 0px", color: "#595959" }}>
                <Typography>{openViewModal.description}</Typography>
              </Stack>
              <Stack direction="column" spacing={2} m={3}>
                <Typography
                  id="modal-modal-description"
                  variant="h6"
                  component="h6"
                >
                  Documents:
                </Typography>
                <CardMedia
                  component="img"
                  sx={{ width: 600 }}
                  image={openViewModal.document1}
                  alt="Profile"
                />
                {openViewModal.document2 && (
                  <CardMedia
                    component="img"
                    sx={{ width: 600 }}
                    image={openViewModal.document2}
                    alt="Profile"
                  />
                )}
              </Stack>
            </Stack>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default MechanicRequestsPage;
