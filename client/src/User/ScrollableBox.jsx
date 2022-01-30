import { Avatar, Stack, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMsg,
  isSameSenderMargin,
  isSameUser,
  isSender,
} from "../config/ChatAbout";
import "../App.css";
import { ChatState } from "../Context/ChatProvider";

const ScrollableBox = ({ msg }) => {
  const { user } = ChatState();
  return (
    <Stack overflowY={"auto"}>
      {msg &&
        msg.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSender(msg, m, i, user._id) || isLastMsg(msg, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#f5f5f5" : "#fcd12a"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(msg, m, i, user._id),
                marginTop: isSameUser(msg, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </Stack>
  );
};

export default ScrollableBox;
