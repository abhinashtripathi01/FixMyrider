import {
  Typography,
  Rating,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Container, Stack, Box } from "@mui/system";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import ReviewCard from "./ReviewCard";
import mainContext from "../../context/mainContext";
import { API_URL } from "../../globalConstants";
import { EmailIcon, LocationIcon, PhoneIcon } from "../../assets/icons";
import BlackButton from "../../components/BlackButton";
const theme = createTheme({
  palette: {
    primary: {
      main: "#574b90",
    },
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "16px",
  p: 4,
};

const SinglePage = (props) => {
  const context = useContext(mainContext);
  const { createChat, handleAlert } = context;
  const [data, setData] = useState();
  console.log(data, "data99");
  const params = useParams();
  const { slug } = params;
  const [rating, setRating] = useState();
  const [comment, setComment] = useState();
  const [reviewId, setReviewId] = useState();
  const [allReviews, setReviews] = useState();
  // const [message, setMessage] = useState(null);
  const [openRequestHelp, setOpenRequestHelp] = useState(false);

  const [requestData, setRequestData] = useState({
    vehicleName: "",
    vehicleModel: "",
    type: "2-Wheeler",
    problemDescription: "",
  });

  const handleRequestDataChange = (id, value) => {
    setRequestData((prev) => {
      const newData = { ...prev };
      newData[id] = value;
      return newData;
    });
  };
  //for modal
  const [open, setOpen] = useState(false);
  const [openAddReview, setOpenAddReview] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setRating(reviewId.rating);
    setComment(reviewId.comment);
  };
  const handleReportOpen = () => {};
  const handleClose = () => setOpen(false);

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const fetchMechanic = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mechanic/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setData(data);

      // to check if user has reviewed
      const reviewResponse = await fetch(
        `${API_URL}/api/review/mechanic/${data._id}/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reviewData = await reviewResponse.json();
      setReviewId(reviewData);

      //fetch reviews
      const reviews = await fetch(
        `${API_URL}/api/review/mechanic/${data._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reviewsData = await reviews.json();
      setReviews(reviewsData);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    fetchMechanic();
  }, [slug]);

  // to add review
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/review/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
        mechanicId: data._id,
      }),
    });

    const back = await response.json();

    handleAlert(back.message, "info");
    fetchMechanic();
    setComment("");
    setRating();
    setOpenAddReview(false);
  };

  //to update user's review
  const handleUpdate = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/review/${reviewId._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    });
    const back = await response.json();
    handleAlert(back.message, "info");
    fetchMechanic();
    handleClose();
  };

  //to delete user's review
  const handleDelete = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/review/${reviewId._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const back = await response.json();

    handleAlert(back.message, "error");
    fetchMechanic();
    setComment("");
    setRating("");
  };
  // to submit report

  const handleRequestHelp = async () => {
    if (
      requestData.vehicleName &&
      requestData.vehicleModel &&
      requestData.type &&
      requestData.problemDescription
    ) {
      const response = await fetch(`${API_URL}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          mechanicId: data._id,
          vehicleName: requestData.vehicleName,
          vehicleModel: requestData.vehicleModel,
          vehicleType: requestData.type,
          problemDescription: requestData.problemDescription,
        }),
      });

      const res = await response.json();

      if (res?.success) {
        handleAlert("Order is successfully placed", "success");
        setOpenRequestHelp(false);
      } else {
        handleAlert(res?.message, "error");
      }
    } else {
      handleAlert("Please fill the required fields", "error");
    }
  };
  return (
    <ThemeProvider theme={theme}>
      {data ? (
        <div style={{ padding: "40px 6%" }}>
          <Stack
            direction="row"
            alignItems="start"
            spacing={2}
            justifyContent="space-between"
            flexWrap="wrap"
            gap="20px"
          >
            <Stack direction="row" alignItems="start" spacing={2} mt={4}>
              <img
                src={data.image}
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
                <div style={{ fontSize: "24px" }}>{data.name}</div>
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
                  {data.email}
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
                  {data.phone}
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
                  {data.address}
                </div>
              </div>
            </Stack>
            <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
              <BlackButton
                label="Message"
                onClick={() => createChat(data.userId)}
                buttonStyle={{
                  border: "1px solid #242424",
                  color: "#242424",
                  background: "white",
                  fontSize: "14px",
                  width: "100px",
                  fontWeight: "600",
                }}
              />
              <BlackButton
                label="Request Help"
                onClick={() => {
                  setOpenRequestHelp(true);
                  setRequestData({
                    vehicleName: "",
                    vehicleModel: "",
                    type: "2-Wheeler",
                    problemDescription: "",
                  });
                }}
                buttonStyle={{
                  fontSize: "14px",
                  width: "130px",
                  fontWeight: "600",
                }}
              />
            </Stack>
          </Stack>
          <Stack sx={{ margin: "24px 0px", color: "#595959" }}>
            <Typography>{data.description}</Typography>
          </Stack>
          <Stack
            spacing={0.5}
            sx={{
              fontSize: "20px",
              borderBottom: "1px solid #BBBBBB",
              paddingBottom: "20px",
            }}
            gap="5px"
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Customer Reviews
              {!reviewId && (
                <BlackButton
                  label="Add Review"
                  onClick={() => setOpenAddReview(true)}
                  buttonStyle={{
                    border: "1px solid #242424",
                    color: "#242424",
                    background: "white",
                    fontSize: "14px",
                    width: "100px",
                    fontWeight: "600",
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              {data?.rating?.toFixed(1)}
              <Rating
                name="read-only"
                value={data.rating}
                readOnly
                xs={{ paddingTop: "10px" }}
              />
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#6A737D",
                }}
              >
                Based on {data.numReviews} ratings
              </div>
            </div>
          </Stack>

          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            mt={3}
            mb={4}
          >
            {/* {reviewId && (
              <Grid item xs={6}>
                <Typography variant="h5">Your Review</Typography>

                <Stack
                  direction="row"
                  mt={1}
                  justifyContent="flex-end"
                  spacing={1}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpen}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Stack>
              </Grid>
            )} */}
            <Grid item xs={12}>
              <div style={{ maxHeight: 460, overflow: "auto" }}>
                {allReviews && allReviews.length === 0 && (
                  <>
                    <Typography m="1rem">No Reviews Yet</Typography>
                  </>
                )}
                {allReviews &&
                  allReviews.map((review) => {
                    return (
                      <ReviewCard
                        review={review}
                        reviewId={reviewId}
                        handleUpdate={handleOpen}
                        handleDelete={handleDelete}
                      />
                    );
                  })}
              </div>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div
          style={{
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {/* modal for update review */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box component="form" onSubmit={handleUpdate}>
            <Typography variant="h5">Update Review</Typography>
            <Stack direction="column" spacing={2} mt={1}>
              <Rating
                name="simple-controlled"
                value={rating}
                required
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <TextField
                id="outlined-basic"
                label="Review"
                variant="outlined"
                multiline
                rows={3}
                value={comment}
                required
                onChange={(e) => {
                  setComment(e.target.value);
                  console.log(comment);
                }}
                inputProps={{ maxLength: 130 }}
              />

              <BlackButton label="Update" onClick={handleUpdate} />
            </Stack>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openAddReview}
        onClose={() => setOpenAddReview(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid item xs={6}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5">Add Review</Typography>
              <Stack direction="column" spacing={2} mt={1}>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  required
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Review"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={comment}
                  required
                  onChange={(e) => {
                    setComment(e.target.value);
                    console.log(comment);
                  }}
                  inputProps={{ maxLength: 130 }}
                />

                <BlackButton
                  label="Submit"
                  type="submit"
                  onClick={handleSubmit}
                />
              </Stack>
            </Box>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={openRequestHelp}
        onClose={() => setOpenRequestHelp(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid item xs={6}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5">Request Help</Typography>
              <Stack direction="column" spacing={2} mt={2}>
                <TextField
                  id="outlined-basic"
                  label="Vehicle Name"
                  variant="outlined"
                  handleRequestDataChange
                  value={requestData.vehicleName}
                  onChange={(e) =>
                    handleRequestDataChange("vehicleName", e.target.value)
                  }
                  required
                  inputProps={{ maxLength: 130 }}
                />
                <TextField
                  id="outlined-basic"
                  label="Vehicle Model"
                  value={requestData.vehicleModel}
                  onChange={(e) =>
                    handleRequestDataChange("vehicleModel", e.target.value)
                  }
                  variant="outlined"
                  required
                  inputProps={{ maxLength: 130 }}
                />
                <FormControl>
                  <InputLabel id="simple-select-label">Type*</InputLabel>
                  <Select
                    label="Type"
                    labelId="simple-select-label"
                    value={requestData.type}
                    onChange={(e) =>
                      handleRequestDataChange("type", e.target.value)
                    }
                  >
                    <MenuItem value="2-Wheeler">2-Wheeler/Bike</MenuItem>
                    <MenuItem value="3-Wheeler">3-Wheeler</MenuItem>
                    <MenuItem value="4-Wheeler">4-Wheeler</MenuItem>
                    <MenuItem value="6-Wheeler">6-Wheeler</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  id="outlined-basic"
                  label="Problem Description"
                  value={requestData.problemDescription}
                  onChange={(e) =>
                    handleRequestDataChange(
                      "problemDescription",
                      e.target.value
                    )
                  }
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                  inputProps={{ maxLength: 130 }}
                />

                <BlackButton
                  label="Submit"
                  type="submit"
                  onClick={handleRequestHelp}
                  // disable={true}
                />
              </Stack>
            </Box>
          </Grid>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default SinglePage;
