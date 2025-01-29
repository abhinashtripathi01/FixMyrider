import React, { useContext, useEffect, useState } from "react";
import "./styles.css";
import {
  AverageRating,
  MechanicRequests,
  PendingOrders,
  TotalCustomers,
  TotalMechanics,
  TotalOrders,
  TotalUsers,
} from "../../assets/icons";
import { API_URL } from "../../globalConstants";
import { CircularProgress } from "@mui/material";
import mainContext from "../../context/mainContext";

const SellerDashboard = () => {
  const { fetchMechanic, mechanicData } = useContext(mainContext);
  const [stats, setStats] = useState();

  const fetchStats = async (mechanicId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/mechanic/stats/${mechanicId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchMechanic();
  }, []);

  useEffect(() => {
    if (mechanicData) {
      console.log(mechanicData, "MechanicDatra");
      fetchStats(mechanicData._id);
    }
  }, [mechanicData]);

  return (
    <div className="admin-container">
      <div className="title">Dashboard</div>{" "}
      {stats ? (
        <div className="counter-section">
          <div className="counter">
            <div className="count-section">
              Pending Orders <div className="count">{stats?.pendingOrders}</div>
            </div>
            <PendingOrders />
          </div>
          <div className="counter">
            <div className="count-section">
              Total Orders <div className="count">{stats?.totalOrders}</div>
            </div>
            <TotalOrders />
          </div>
          <div className="counter">
            <div className="count-section">
              Average Rating <div className="count">{mechanicData?.rating}</div>
            </div>
            <AverageRating />
          </div>
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
    </div>
  );
};

export default SellerDashboard;
