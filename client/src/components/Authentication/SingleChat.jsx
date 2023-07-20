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

import io from "socket.io-client";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const EndPoint = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetch, setfetch }) => {
  const axiosPrivateFetchMsg = useAxiosPrivate();
  const axiosPrivateSendMsg = useAxiosPrivate();
  const [msg, setMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [socketconnection, setSocketconnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [online, setonline] = useState(false);
  const { auth, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const toast = useToast();

  const fetchMsg = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axiosPrivateFetchMsg.get(
        `/api/message/${selectedChat._id}`
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
        setNewMsg("");
        const { data } = await axiosPrivateSendMsg.post("/api/message", {
          content: newMsg,
          chatId: selectedChat._id,
        });
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
    socket.emit("setup", auth);

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
            width="100%"
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(auth, selectedChat.users)}
                <ProfileModal
                  auth={getSenderObject(auth, selectedChat.users)}
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
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#e8e8e8"}
            borderRadius={"lg"}
            width={"100%"}
            height={"100%"}
            overflowY={"clip"}
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
              <ScrollableBox msg={msg} />
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
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          height="100%"
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
            Click on a user to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
