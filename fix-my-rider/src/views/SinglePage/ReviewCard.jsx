import React from "react";
import { Stack, Typography, Rating } from "@mui/material";
import BlackButton from "../../components/BlackButton";
import UserProfile from "../../components/UserProfile";

const ReviewCard = (props) => {
  const { review, reviewId, handleUpdate, handleDelete } = props;

  return (
    <div style={{ borderBottom: "1px solid #bbbbbb", padding: "18px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1}>
          <UserProfile
            name={review.userId.username}
            size="30px"
            fontSize="14px"
            url={review.userId.image}
          />
          <div style={{ fontWeight: "600", fontSize: "14px" }}>
            {review.userId.username}{" "}
            <div
              style={{ fontWeight: "500", fontSize: "12px", color: "#6A737D" }}
            >
              {review?.userId?.address}
            </div>
          </div>
        </Stack>
        {reviewId?._id === review?._id && (
          <div style={{ display: "flex", gap: "10px" }}>
            <BlackButton
              label="Edit Review"
              onClick={handleUpdate}
              buttonStyle={{
                border: "1px solid #242424",
                color: "#242424",
                background: "white",
                fontSize: "14px",
                width: "120px",
                fontWeight: "600",
              }}
            />

            <BlackButton
              label="Delete"
              onClick={handleDelete}
              buttonStyle={{
                border: "1px solid #EE2625",
                color: "#EE2625",
                background: "white",
                fontSize: "14px",
                width: "100px",
                fontWeight: "600",
              }}
            />
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          marginTop: "4px",
        }}
      >
        <Rating
          name="read-only"
          value={review.rating}
          readOnly
          xs={{ paddingTop: "10px" }}
        />
        {new Date(review?.createdAt).toLocaleDateString()}
      </div>
      <Typography mt={1}>{review.comment}</Typography>
      <Typography mt={1} variant="overline">
        {" "}
      </Typography>
    </div>
  );
};

export default ReviewCard;
