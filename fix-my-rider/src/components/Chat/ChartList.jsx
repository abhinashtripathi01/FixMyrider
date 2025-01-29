import React, { useState } from "react";
import { getSender, getSenderFull, getSenderRole } from "./chatLogic";
import { Grid, Box, Typography, Stack, Chip } from "@mui/material";
import { useContext, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import mainContext from "../../context/mainContext";
import UserProfile from "../UserProfile";
import { formatTimestamp } from "../../Utils";
const ChartList = () => {
  const context = useContext(mainContext);
  const {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    userData,
    fetchUserData,
  } = context;
  const [isLoading, setIsLoading] = useState(false);
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8800/api/chat/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setChats(data);
      setIsLoading(false);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (userData.userId) {
      fetchUserData();
    }
  }, []);
  useEffect(() => {
    if (userData.userId) {
      fetchChats();
    }
  }, [userData]);

  console.log(selectedChat);
  console.log(chats);
  return (
    <Box>
      <Grid container sx={{ height: "70vh", overflow: "auto" }}>
        <Stack flexDirection="column" sx={{ width: 1 }} gap={2}>
          {!isLoading ? (
            <>
              {chats?.length > 0 ? (
                chats.map((chat) => {
                  return (
                    <Box
                      onClick={() => setSelectedChat(chat)}
                      sx={{
                        cursor: "pointer",
                        borderBottom:
                          selectedChat === chat
                            ? "1px solid #1976d2"
                            : "1px solid #bbb",
                        display: "flex",
                        alignItems: "top",
                        gap: "10px",
                        justifyContent: "space-between",
                        width: "390px",
                      }}
                      px={1}
                      py={1}
                      key={chat._id}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <UserProfile
                          name={getSender(userData, chat.users)}
                          url={getSenderFull(userData, chat.users)?.image}
                        />

                        <div>
                          <Typography
                            fontSize={18}
                            fontWeight={600}
                            noWrap={true}
                            maxWidth={200}
                          >
                            {getSender(userData, chat.users)}
                            <span style={{ fontSize: "14px" }}>
                              {getSenderRole(userData, chat.users) ===
                                "seller" &&
                                getSenderFull(userData, chat.users)
                                  ?.mechanicData?.name &&
                                `|  ${
                                  getSenderFull(userData, chat.users)
                                    ?.mechanicData?.name
                                }`}
                            </span>
                          </Typography>

                          {chat.latestMessage ? (
                            <Typography fontSize={14} color="#303030">
                              {chat.latestMessage.content.length > 50
                                ? chat.latestMessage.content.substring(0, 51) +
                                  "..."
                                : chat.latestMessage.content}
                            </Typography>
                          ) : (
                            <Typography
                              fontSize={14}
                              color="#646464"
                              fontWeight="600"
                            >
                              No Chat History
                            </Typography>
                          )}
                        </div>
                      </div>
                      {chat?.latestMessage?.createdAt && (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#7C7C7C",
                            marginTop: "4px",
                          }}
                        >
                          {formatTimestamp(chat.latestMessage.createdAt)}
                        </div>
                      )}
                    </Box>
                  );
                })
              ) : (
                <div
                  style={{
                    minWidth: "300px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  No Charts
                </div>
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
        </Stack>
      </Grid>
    </Box>
  );
};

export default ChartList;
