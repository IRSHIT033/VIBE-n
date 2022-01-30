import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatAbout";
import GroupChat from "./GroupChat";

const Chats = ({ fetch }) => {
  const [loggedUser, setloggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setchats } = ChatState();
  const toast = useToast();
  const fetch_Chats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setchats(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("Info")));
    fetch_Chats();
  }, [fetch]);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "20px" }}
        fontFamily={"Work sans"}
        d="flex"
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        Chats
        <GroupChat>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Create New Group
          </Button>
        </GroupChat>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#f8f8f8"
        w="100%"
        h="100%"
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                }}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#fcd12a" : "#e8e8e8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>
                      {chat.latestMessage.sender.name === user.name
                        ? "Me"
                        : chat.latestMessage.sender.name}{" "}
                      :{" "}
                    </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default Chats;
