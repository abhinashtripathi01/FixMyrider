import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../globalConstants";
import { CloseSharp } from "@mui/icons-material";
import { EmailIcon, LocationIcon, PhoneIcon } from "../../assets/icons";
import mainContext from "../../context/mainContext";
import UserProfile from "../../components/UserProfile";
import { getDateAndTime } from "../../Utils";
import "./styles.css";
import BlackButton from "../../components/BlackButton";
const statusList = ["Requested", "Confirmed", "Delivered", "Cancelled"];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  minWidth: "300px",
};

const OrderList = () => {
  const [openPaymentSettlement, setPaymentSettlement] = useState();
  const [paymentSettlementData, setPaymentSettlementData] = useState();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [data, setData] = useState(null);
  const { handleAlert, userData, fetchUserData, createChat } =
    useContext(mainContext);
  var token = localStorage.getItem("token");

  //item data
  const [items, setItems] = useState([{ id: "1", quantity: "", price: "" }]);
  const [serviceCharge, setServiceCharge] = useState(0);

  const [orderId, setOrderId] = useState();

  const closeGenerateReceipt = () => {
    setOrderId();
    setItems([{ id: "1", quantity: "", price: "" }]);
    setServiceCharge(0);
  };

  const handleItemDataChange = (id, key, value) => {
    setItems((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((item) => item.id === id);
      if (index >= 0) {
        newData[index][key] = value;
      }
      return newData;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), item: "", quantity: 0, price: 0 },
    ]);
  };

  // Remove an item
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    const itemsTotal = items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
    return itemsTotal + Number(serviceCharge);
  };

  const fetchMechanicOrders = () => {
    fetch(`${API_URL}/api/order/mechanic/${userData?.mechanicId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  useEffect(() => {
    if (userData?.mechanicId) {
      fetchMechanicOrders();
    } else {
      fetchUserData();
    }
  }, [userData]);

  const getPaymentReceipt = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/receipt/${openPaymentSettlement}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const response = await res.json();
      if (response.success) {
        setPaymentSettlementData(response?.receipt);
      } else {
        handleAlert(response.message, "error");
      }
    } catch (e) {
      console.error(e);
      handleAlert("Server Error", "error");
    }
  };

  useEffect(() => {
    if (openPaymentSettlement) {
      getPaymentReceipt();
    }
  }, [openPaymentSettlement]);
  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/order/status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        handleAlert("Status updated successfully", "success");
        fetchMechanicOrders();
      } else {
        handleAlert(data.message, "error");
      }
    } catch (error) {
      handleAlert("Server error. Please try again later.", "error");
    }
  };

  const handleSaveReceipt = async () => {
    const payload = {
      orderId,
      serviceCharge,
      totalAmount: calculateTotal(),
      items,
    };

    try {
      const response = await fetch(`${API_URL}/api/receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data?.success) {
        handleAlert(data?.message, "success");
        closeGenerateReceipt();
      } else {
        handleAlert(data?.message, "error");
      }
    } catch (error) {
      handleAlert("Failed to save order.", "error");
    }
  };

  return (
    <div className="admin-container">
      <div className="title">Order List</div>
      <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "700" }}>Client Name</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Order Date</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Vehicle Type</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Vehicle Name</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Vehicle Model</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      height: "100%",
                    }}
                  >
                    <UserProfile
                      name={row?.userId?.username}
                      size="30px"
                      url={row?.userId?.image}
                    />

                    {row?.userId?.username}
                  </div>
                </TableCell>
                <TableCell>{getDateAndTime(row?.createdAt)}</TableCell>
                <TableCell>{row.vehicleType}</TableCell>
                <TableCell>{row?.vehicleName}</TableCell>
                <TableCell>{row?.vehicleModel}</TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={row?.status}
                      onChange={(e) =>
                        handleStatusChange(row._id, e.target.value)
                      }
                      style={{ fontSize: "14px" }}
                      disabled={row.paid}
                    >
                      {statusList.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    {!row?.paid &&
                      (row?.status === "Delivered" ? (
                        <Button
                          sx={{
                            border: "1px solid #111111",
                            color: "#111111",
                            height: "30px",
                            fontSize: "12px",
                            lineHeight: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => setOrderId(row?._id)}
                        >
                          Generate Receipt
                        </Button>
                      ) : (
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
                          View Problem
                        </Button>
                      ))}
                    {row?.paid && (
                      <Button
                        sx={{
                          border: "1px solid rgb(12, 132, 72)",
                          color: "rgb(12, 132, 72)",
                          height: "30px",
                          fontSize: "12px",
                          lineHeight: "12px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => setPaymentSettlement(row._id)}
                      >
                        Payment Receipt
                      </Button>
                    )}
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
                      onClick={() => createChat(row?.userId?._id)}
                    >
                      Chat
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "700",
            }}
          >
            Problem Description
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setOpenViewModal(false)}
            >
              <CloseSharp />
            </div>
          </div>

          <Stack direction="row" alignItems="start" spacing={2} mt={1}>
            <div style={{ fontSize: "14px" }}>
              {openViewModal?.problemDescription}
            </div>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={orderId}
        onClose={() => closeGenerateReceipt()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            minWidth: "500px",
            borderRadius: "12px",
          }}
          className="recepit-container"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            Generate Receipt
            <div
              style={{ cursor: "pointer" }}
              onClick={() => closeGenerateReceipt()}
            >
              <CloseSharp />
            </div>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#696969",
            }}
          >
            Include all services and spare parts details for billing
          </div>

          <div className="receipt-items">
            <table>
              <tr>
                <th>ITEM</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
                <th>AMOUNT</th>
                <th>ACTION</th>
              </tr>
              {items?.map((row) => (
                <tr className="data">
                  <td>
                    <TextField
                      sx={{ width: "300px" }}
                      fullWidth
                      size="small"
                      value={row.item}
                      onChange={(e) =>
                        handleItemDataChange(row.id, "item", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <TextField
                      fullWidth
                      size="small"
                      value={row.quantity}
                      type="number"
                      onChange={(e) =>
                        handleItemDataChange(row.id, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <TextField
                      fullWidth
                      size="small"
                      value={row.price}
                      type="number"
                      onChange={(e) =>
                        handleItemDataChange(row.id, "price", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <TextField
                      fullWidth
                      size="small"
                      disabled
                      value={row.quantity * row.price}
                      type="number"
                    />
                  </td>
                  <td>
                    <Button
                      sx={{
                        border: "1px solid #FF6666",
                        color: "#FF6666",
                        height: "38px",
                        fontSize: "12px",
                        lineHeight: "12px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => removeItem(row.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </table>
          </div>

          <div className="add-action">
            <Button
              sx={{
                border: "1px solid #111111",
                color: "#111111",
                height: "34px",
                fontSize: "12px",
                lineHeight: "12px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={addItem}
            >
              + Add Item
            </Button>
          </div>

          <div className="service-field">
            Service Charge:
            <TextField
              size="small"
              type="number"
              value={serviceCharge}
              sx={{ width: "100px" }}
              onChange={(e) => setServiceCharge(Number(e.target.value))}
            />
          </div>

          <div className="service-field">
            Total Amount:
            <TextField
              size="small"
              value={calculateTotal()}
              sx={{ width: "100px", color: "black" }}
              disabled
            />
          </div>

          <div className="service-field">
            <BlackButton
              label="Confirm"
              buttonStyle={{ width: "100px" }}
              onClick={handleSaveReceipt}
            />
          </div>
          <Stack direction="row" alignItems="start" spacing={2} mt={1}>
            <div style={{ fontSize: "14px" }}>
              {openViewModal?.problemDescription}
            </div>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openPaymentSettlement}
        onClose={() => setPaymentSettlement(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            fontWeight={600}
          >
            Payment Receipt
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setPaymentSettlement(false)}
            >
              <CloseSharp />
            </div>
          </Typography>
          <div
            style={{
              fontSize: "14px",
              color: "#696969",
            }}
          >
            Includes all services and spare parts
          </div>
          {paymentSettlementData && (
            <>
              <div className="receipt-items">
                <table style={{ minWidth: "500px" }}>
                  <tr>
                    <th>ITEM</th>
                    <th>QUANTITY</th>
                    <th>PRICE</th>
                    <th>AMOUNT</th>
                  </tr>
                  {paymentSettlementData?.items?.map((row) => (
                    <tr className="data">
                      <td>{row?.item}</td>
                      <td>{row?.quantity}</td>
                      <td>{row?.price}</td>
                      <td>{row?.quantity * row?.price}</td>
                    </tr>
                  ))}
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <div className="service-field">
                  Service Charge: {paymentSettlementData?.serviceCharge}
                </div>
                Total Amount: {paymentSettlementData?.totalAmount}
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default OrderList;
