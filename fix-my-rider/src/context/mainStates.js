import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mainContext from "./mainContext";
import { API_URL } from "../globalConstants";
const data = [];

const MainStates = (props) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [lng, setLng] = useState(false);
  const [lat, setLat] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [mechanicData, setMechanicData] = useState();
  //  chats
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const handleAlert = (message, severity) => {
    setOpen(true);
    setAlert({
      msg: message,
      severity: severity,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // Function to fetch the user data
  async function fetchUserData() {
    const token = localStorage.getItem("token");

    // if (!token) {
    //   navigate("/signin");
    // }

    try {
      const response = await fetch("http://localhost:8800/api/user/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch the user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // To fetch Chef Data
  const fetchMechanic = async () => {
    try {
      const response = await fetch(
        "http://localhost:8800/api/mechanic/fetch/user",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setMechanicData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createChat = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Chat created successfully
        const data = await response.json();
        console.log(data);
        navigate("/chat");
        setSelectedChat(data);
        console.log(data);
      } else {
        const errorData = await response.json();
        console.error("Failed to create chat:", errorData);
      }
    } catch (error) {
      // Handle error
      console.error("Failed to create chat:", error.message);
    }
  };

  return (
    <mainContext.Provider
      value={{
        userData,
        setUserData,
        alert,
        handleAlert,
        handleClose,
        open,
        navigate,
        setLng,
        setLat,
        lat,
        lng,
        mechanics,
        setMechanics,
        fetchMechanic,
        mechanicData,
        setMechanicData,
        fetchUserData,

        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        createChat,
      }}
    >
      {props.children}
    </mainContext.Provider>
  );
};

export default MainStates;
