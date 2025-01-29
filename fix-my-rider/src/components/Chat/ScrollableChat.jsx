import { Tooltip, Avatar } from "@mui/material";

import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./chatLogic";
import { useContext } from "react";
import mainContext from "../../context/mainContext";

const isValidUrl = (string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // Protocol
      "((([a-zA-Z\\d$-_.+!*'(),]|%[0-9a-fA-F]{2})+)(:[0-9]+)?)" + // Hostname and port
      "(\\/([a-zA-Z\\d$-_.+!*'(),]|%[0-9a-fA-F]{2})*)*" + // Path
      "(\\?([;&a-zA-Z\\d$-_.+!*'(),]|%[0-9a-fA-F]{2})*)?" + // Query
      "(\\#([a-zA-Z\\d$-_.+!*'(),]|%[0-9a-fA-F]{2})*)?$", // Fragment
    "i"
  );
  return urlPattern.test(string);
};

const ScrollableChat = ({ messages }) => {
  const context = useContext(mainContext);
  const { userData } = context;

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === userData.userId ? "#4379EE" : "#E7E7E7"
                }
                `,
                color: `${
                  m.sender._id === userData.userId ? "#fff" : "#303030"
                } `,
                marginLeft: isSameSenderMargin(messages, m, i, userData.userId),
                marginTop: isSameUser(messages, m, i, userData.userId) ? 3 : 10,
                borderRadius: "20px",
                padding: "10px 18px",
                maxWidth: "70%",
              }}
            >
              {isValidUrl(m.content) ? (
                <a
                  href={m.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color:
                      m.sender._id === userData.userId ? "#fff" : "#4379EE",
                  }}
                >
                  {m.content}
                </a>
              ) : (
                m.content
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
