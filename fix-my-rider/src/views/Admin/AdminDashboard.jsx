import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  MechanicRequests,
  PendingOrders,
  TotalCustomers,
  TotalMechanics,
  TotalUsers,
} from "../../assets/icons";
import { API_URL } from "../../globalConstants";
import { CircularProgress } from "@mui/material";

const AdminDashboard = () => {
  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-container">
      <div className="title">Dashboard</div>{" "}
      {stats ? (
        <div className="counter-section">
          <div className="counter">
            <div className="count-section">
              Total Mechanics <div className="count">{stats?.totalSellers}</div>
            </div>
            <TotalMechanics />
          </div>
          <div className="counter">
            <div className="count-section">
              Total Customers{" "}
              <div className="count">{stats?.totalCustomers}</div>
            </div>
            <TotalCustomers />
          </div>
          <div className="counter">
            <div className="count-section">
              Total Users <div className="count">{stats?.totalUsers}</div>
            </div>
            <TotalUsers />
          </div>
          <div className="counter">
            <div className="count-section">
              Mechanic Requests{" "}
              <div className="count">{stats?.totalSellerRequests}</div>
            </div>
            <MechanicRequests />
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

export default AdminDashboard;
