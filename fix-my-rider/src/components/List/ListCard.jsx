import React, { useContext } from "react";
import { Typography, Card, Rating } from "@mui/material";
import BlackButton from "../BlackButton";
import mainContext from "../../context/mainContext";

const ListCard = ({ data }) => {
  const context = useContext(mainContext);
  const { navigate, createChat } = context;
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #969696",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "none",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          borderBottom: "1px solid #EAEAEA",
          paddingBottom: "4px",
        }}
      >
        <img
          src={data.image}
          width="40px"
          height="40px"
          style={{
            objectFit: "cover",
            borderRadius: "4px",
            boxShadow:
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
          }}
        />
        <div
          style={{
            fontSize: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {data.name}
            <div style={{ fontSize: "14px", color: "#595959" }}>
              ({data?.distance?.toFixed(2)} KM)
            </div>
          </div>
          <div style={{ fontSize: "14px", color: "#595959" }}>
            {data.address}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Rating
              name="read-only"
              value={data.rating}
              readOnly
              xs={{ paddingTop: "10px" }}
            />
            <div
              style={{
                fontSize: "14px",
                color: "#595959",
                fontWeight: "700",
              }}
            >
              {data.rating.toFixed(1)}/5
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#595959",
              }}
            >{`${data.numReviews || 0} Reviews`}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          paddingTop: "16px",
        }}
      >
        <BlackButton
          label="Message"
          buttonStyle={{
            border: "1px solid #242424",
            color: "#242424",
            background: "white",
            fontSize: "14px",
            width: "100px",
            fontWeight: "600",
          }}
          onClick={(event) => {
            event.stopPropagation();
            createChat(data.userId);
          }}
        />
        <BlackButton
          label="View"
          onClick={() => navigate("/mechanic/" + data.slug)}
          buttonStyle={{
            fontSize: "14px",
            width: "100px",
            fontWeight: "600",
          }}
        />
      </div>
    </div>
  );
};

export default ListCard;
