import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider.js";
import SlideBar from "../miscellaneous/SlideBar";
import Chats from "../miscellaneous/Chats";
import ChatBox from "../miscellaneous/ChatBox";
const ChatPage = () => {
  const { user } = ChatState();
  const [fetch, setfetch] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SlideBar />}
      <Box
        d="flex"
        justifyContent={"space-between"}
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <Chats fetch={fetch} />}
        {user && <ChatBox fetch={fetch} setfetch={setfetch} />}
      </Box>
    </div>
  );
};
export default ChatPage;
