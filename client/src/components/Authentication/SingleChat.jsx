import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderObject } from "../../config/ChatAbout";
import ProfileModal from "../../miscellaneous/ProfileModel";
import UpDateGroup from "../../miscellaneous/UpDateGroup";
import ScrollableBox from "../../User/ScrollableBox";
import axios from "axios";
import io from "socket.io-client";

const EndPoint = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetch, setfetch }) => {
  const [msg, setMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [socketconnection, setSocketconnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [online, setonline] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const toast = useToast();

  const fetchMsg = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setLoading(false);
      setMsg(data);
      socket.emit("joinRoom", selectedChat._id);
    } catch (err) {
      toast({
        title: "Error Occured!",
        status: "Failed to Fetch the message",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMsg = async (e) => {
    if (e.key === "Enter" && newMsg) {
      socket.emit("typing stopped", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMsg("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMsg,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("newMsg", data);
        setMsg([...msg, data]);
      } catch (err) {
        toast({
          title: "Error Occured!",
          status: "Failed to send the message",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  useEffect(() => {
    fetchMsg();
    selectedChatCompare = selectedChat;
  }, [selectedChat]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    socket = io(EndPoint);
    socket.emit("setup", user);

    socket.on("connected", (users) => {
      setSocketconnection(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("typing stopped", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("got the msg", (newMsgrecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMsgrecieved.chat._id
      ) {
        if (!notification.includes(newMsgrecieved)) {
          setNotification([newMsgrecieved, ...notification]);
          setfetch(!fetch);
        }
      } else {
        setMsg([...msg, newMsgrecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMsg(e.target.value);
    if (!socketconnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTyping = new Date().getTime();
    var time_len = 3000;
    setTimeout(() => {
      var time = new Date().getTime();
      var timediff = time - lastTyping;
      if (timediff >= time_len && typing) {
        socket.emit("typing stopped", selectedChat._id);
        setTyping(false);
      }
    }, time_len);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Work sans"}
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderObject(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpDateGroup
                  fetch={fetch}
                  setfetch={setfetch}
                  fetchMsg={fetchMsg}
                />
              </>
            )}
          </Text>
          <Box
            d={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#e8e8e8"}
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableBox msg={msg} />
              </div>
            )}
            <FormControl onKeyDown={sendMsg} isRequired mt={3}>
              {isTyping ? <div m={2}>Typing...</div> : <></>}
              <Input
                variant={"filled"}
                bg="#e0e0e0"
                placeholder="enter a message.."
                onChange={typingHandler}
                value={newMsg}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d={"flex"} alignItems="center" justifyContent={"center"} h="100%">
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
            Click on a user to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
