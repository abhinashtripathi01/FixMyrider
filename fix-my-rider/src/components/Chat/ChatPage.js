import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  FormControl,
  Input,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import "./style.css";
import { useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import ChartList from "./ChartList";
import CircularProgress from "@mui/material/CircularProgress";
import ScrollableChat from "./ScrollableChat";
import { getSender, getSenderFull, getSenderRole } from "./chatLogic";
import io from "socket.io-client";
import mainContext from "../../context/mainContext";
import { API_URL } from "../../globalConstants";
import "./style.css";
import UserProfile from "../UserProfile";
import { MessageSendIcon } from "../../assets/icons";
import { ShareLocation } from "@mui/icons-material";

var socket, selectedChatCompare;

const ChatPage = () => {
  const context = useContext(mainContext);
  const { selectedChat, userData, fetchUserData } = context;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const response = await fetch(
        `${API_URL}/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setMessages(data);

      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSend = async (event) => {
    console.log(event);
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      try {
        const response = await fetch(`${API_URL}/api/message/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        });
        const data = await response.json();
        setNewMessage("");
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleShareLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          // Open the Google Maps link in a new tab
          try {
            const response = await fetch(`${API_URL}/api/message/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                content: googleMapsLink,
                chatId: selectedChat._id,
              }),
            });
            const data = await response.json();
            setNewMessage("");
            socket.emit("new message", data);
            setMessages((prevMessages) => [...prevMessages, data]);
          } catch (error) {
            alert(error.message);
          }
        },
        (error) => {
          console.error("Error retrieving location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (!userData.userId) {
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    socket = io(API_URL);
    socket.emit("setup", userData);
    socket.on("connected", () => setSocketConnected(true));
  }, [userData]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    // Add a cleanup function to remove the event listener
    return () => {
      socket.off("messageRecieved");
    };
  }, []);

  useEffect(() => {
    socket.once("messageRecieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Notification work
      } else {
        // Check if message already exists in messages state
        const isMessageExists = messages.some(
          (message) => message._id === newMessageRecieved._id
        );

        if (!isMessageExists) {
          fetchMessages();
          setMessages([...messages, newMessageRecieved]);
          return;
        }
      }
    });
  });

  return (
    <div className="messaging-container">
      <div className="title">Inbox</div>
      <div className="messaging-internal-container">
        <div className="list">
          <ChartList />
        </div>
        <div className="chat">
          {!isLoading ? (
            <>
              {!selectedChat ? (
                <Stack
                  flexDirection="row"
                  justifyContent="center"
                  width={1}
                  height={1}
                  alignItems="center"
                >
                  <Typography fontSize={20}>
                    Click on chat to start messaging.
                  </Typography>
                </Stack>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom: "1px solid #BBBBBB",
                    }}
                  >
                    <UserProfile
                      size="40px"
                      name={getSender(userData, selectedChat.users)}
                      url={getSenderFull(userData, selectedChat.users)?.image}
                    />

                    <Typography fontSize={20} fontWeight={600}>
                      {getSender(userData, selectedChat.users)}{" "}
                      <span style={{ fontSize: "14px" }}>
                        {getSenderRole(userData, selectedChat.users) ===
                          "seller" &&
                          getSenderFull(userData, selectedChat.users)
                            ?.mechanicData?.name &&
                          `|  ${
                            getSenderFull(userData, selectedChat.users)
                              ?.mechanicData?.name
                          }`}
                      </span>
                    </Typography>
                  </div>
                  <Box>
                    <div className="messages">
                      <ScrollableChat messages={messages} />
                    </div>

                    <div className="text-input">
                      <FormControl
                        onKeyDown={handleSend}
                        isRequired
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        <Input
                          placeholder="Type your message here..."
                          endAdornment={
                            <InputAdornment position="end">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    handleSend(e);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <MessageSendIcon />
                                </div>
                                <Tooltip title="Share Location">
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={handleShareLocation}
                                  >
                                    <ShareLocation
                                      style={{ color: "#4379EE" }}
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            </InputAdornment>
                          }
                          onChange={(e) => setNewMessage(e.target.value)}
                          value={newMessage}
                        />
                      </FormControl>
                    </div>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                height: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
