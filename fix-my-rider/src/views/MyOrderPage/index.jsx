import React, { useContext, useEffect, useState } from "react";
import "./styles.css";
import "../Seller/styles.css";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { CloseOutlined, CloseSharp, Verified } from "@mui/icons-material";
import {
  CloseStatusIcon,
  CompletedStatusIcon,
  ConfirmedStatusIcon,
  MessagingIcon,
  RequestedStatusIcon,
} from "../../assets/icons";
import { API_URL } from "../../globalConstants";
import { getDateAndTime } from "../../Utils";
import mainContext from "../../context/mainContext";
import BlackButton from "../../components/BlackButton";
const steps = [
  { label: "Cancelled", icon: CloseStatusIcon },
  { label: "Requested", icon: RequestedStatusIcon },
  { label: "Confirmed", icon: ConfirmedStatusIcon },
  { label: "Completed", icon: CompletedStatusIcon },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  minWidth: "350px",
  borderRadius: "12px",
};
const MyOrderPage = () => {
  const [orderData, setOrderData] = useState();
  const [loading, setLoading] = useState(false);
  const { handleAlert } = useContext(mainContext);
  const [paymentMethod, setPaymentMethod] = useState("khalti");

  const [openReportModal, setOpenReportModel] = useState(false);
  const [reportType, setReportType] = useState();
  const [description, setDescription] = useState();
  const [openPaymentSettlement, setPaymentSettlement] = useState();
  const [paymentSettlementData, setPaymentSettlementData] = useState();

  var token = localStorage.getItem("token");
  const getMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/order/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      setOrderData(response);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleAlert("Server Error", "error");
    }
  };

  console.log(paymentSettlementData, "orderData88");

  useEffect(() => {
    getMyOrders();
  }, []);

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

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/order/status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      const data = await response.json();

      if (response.ok) {
        handleAlert("Order Cancelled Successfully", "success");
        getMyOrders();
      } else {
        handleAlert(data.message, "error");
      }
    } catch (error) {
      handleAlert("Server error. Please try again later.", "error");
    }
  };

  const handleReportButton = async (mechanicId) => {
    try {
      const response = await fetch(`${API_URL}/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mechanicId,
          reportType,
          reportDescription: description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        handleAlert(data.message, "success");
        setOpenReportModel(false);
        setDescription();
        setReportType();
      } else {
        handleAlert(data.message, "error");
      }
    } catch (error) {
      handleAlert("Failed to create the report. Please try again.", "error");
      console.log(error);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: paymentSettlementData?.orderId,
          orderName: "FixMyRider Mechanic Order",
          amount: paymentSettlementData?.totalAmount * 100,
          paymentMethod,
        }),
      });

      const response = await res.json();
      if (response?.success) {
        window.location.href = response?.paymentUrl;
      } else {
        handleAlert(response?.message, "error");
      }
    } catch (e) {
      handleAlert("Server error. Please try again later.", "error");
    }
  };

  return (
    <div className="myOrderContainer">
      <div className="title">My Orders</div>{" "}
      <div className="order-list">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {orderData?.map((single) => (
              <div className="order-item">
                <div className="customer-details">
                  <img
                    src={single?.mechanicId?.image}
                    alt=""
                    width="38px"
                    height="38px"
                    style={{ borderRadius: "4px", objectFit: "cover" }}
                  />
                  <div className="center">
                    <div className="top">
                      {single?.mechanicId?.name}
                      <Button
                        sx={{
                          border: "1px solid #43C182",
                          color: "#43C182",
                          height: "24px",
                          fontSize: "12px",
                          lineHeight: "12px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        startIcon={<MessagingIcon />}
                        // onClick={() => handleAccept(row._id)}
                      >
                        Chat
                      </Button>
                    </div>
                    <div className="bottom">
                      {getDateAndTime(single?.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="vehicle-details">
                  <div>
                    <div style={{ fontWeight: "600" }}>Vehicle Name: </div>
                    {single?.vehicleName}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Vehicle Model: </div>
                    {single?.vehicleModel}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Vehicle Type: </div>
                    {single?.vehicleType}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      Problem Description:{" "}
                    </div>
                    {single?.problemDescription}
                  </div>
                </div>
                <div className="status">
                  <div style={{ fontWeight: "600" }}>Status:</div>
                  <Stepper alternativeLabel>
                    {steps.map((item) => (
                      <Step
                        key={item.label}
                        active={item.label === single?.status}
                      >
                        <StepLabel
                          StepIconComponent={item.icon}
                          StepIconProps={{
                            active: item.label === single?.status,
                          }}
                        >
                          {item.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>
                <div className="action-buttons">
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
                    onClick={() => setOpenReportModel(single)}
                  >
                    Report
                  </Button>
                  {single?.status !== "Cancelled" && (
                    <>
                      {!single.paid && !single?.receipt && (
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
                          onClick={() => handleCancelOrder(single._id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                      {single?.receipt && !single.paid && (
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
                          onClick={() => setPaymentSettlement(single._id)}
                        >
                          Payment Settlement
                        </Button>
                      )}
                      {single.paid && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                            color: "green",
                          }}
                        >
                          <Verified sx={{ color: "green", fontSize: "20px" }} />
                          Payment Successful
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Modal
        open={openReportModal}
        onClose={() => setOpenReportModel(false)}
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
            Report {openReportModal?.mechanicId?.name}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setOpenReportModel(false)}
            >
              <CloseSharp />
            </div>
          </Typography>
          <div
            style={{
              margin: "20px 0px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="demo">Select Report Type</InputLabel>
              <Select
                labelId="demo"
                id="demo-multiple-name"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Select Report Type"
              >
                <MenuItem value="Payment">Payment</MenuItem>
                <MenuItem value="Behavior">Behavior</MenuItem>
                <MenuItem value="Damage">Damage</MenuItem>
                <MenuItem value="Fraud">Fraud</MenuItem>
                <MenuItem value="Pricing">Pricing</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <BlackButton
              label="Submit"
              onClick={() =>
                handleReportButton(openReportModal?.mechanicId._id)
              }
            />
          </div>
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
            Payment Settlement
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
                <div>
                  Payment Method:{" "}
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    size="small"
                    disabled
                  >
                    {/* <MenuItem value={"esewa"}>Esewa</MenuItem> */}
                    <MenuItem value={"khalti"}>Khalti</MenuItem>
                  </Select>
                </div>
                <div className="service-field">
                  <BlackButton
                    label="Proceed"
                    buttonStyle={{ width: "100px" }}
                    onClick={handlePayment}
                  />
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default MyOrderPage;
