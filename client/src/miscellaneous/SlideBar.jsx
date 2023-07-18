import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import UserList from "../User/UserList";
import ChatLoading from "./ChatLoading";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileModel from "./ProfileModel";
import { ChatState } from "../Context/ChatProvider";
import { Button } from "@chakra-ui/react";
import { getSender } from "../config/ChatAbout";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

function SlideBar() {
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const {
    auth,
    setSelectedChat,
    chats,
    setchats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title:
          "Please Enter name or email id of the person that you want to find",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setloading(false);
      setsearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        descritption: "Failed to load the search Results",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const access_Chat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching chat",
        description: err.message,
        statue: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FontAwesomeIcon id="sms-icon" icon={faSearch}></FontAwesomeIcon>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          fontWeight={"bold"}
          color={"#fcd12a"}
        >
          VIBE'N
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <Box px={5}>
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <BellIcon fontSize={"2xl"} m={1} />
              </Box>
            </MenuButton>
            <MenuList>
              <Box p="5px 10px 5px 10px">
                {!notification.length && "No new Messages"}
                {notification.map((n) => (
                  <MenuItem
                    key={n._id}
                    onClick={() => {
                      setSelectedChat(n.chat);
                      setNotification(notification.filter((i) => i !== n));
                    }}
                  >
                    {n.chat.isGroupChat
                      ? `Got Message from ${n.chat.chatName}`
                      : `Got Message from ${getSender(user, n.chat.users)}`}
                  </MenuItem>
                ))}
              </Box>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="search by name or emailId"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handlefunc={() => {
                    access_Chat(user._id);
                  }}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SlideBar;
