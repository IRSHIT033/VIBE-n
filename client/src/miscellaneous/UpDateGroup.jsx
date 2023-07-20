import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import BadgeUser from "../User/BadgeUser";
import UserList from "../User/UserList";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UpDateGroup = ({ fetch, setfetch, fetchMsg }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setgroupName] = useState();
  const [search, setsearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const [searchResult, setsearchresult] = useState([]);
  const { auth, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
  const axiosPrivate = useAxiosPrivate();

  const handleremove = async (deluser) => {
    setLoading(true);
    try {
      if (
        selectedChat.groupAdmin._id !== auth._id &&
        deluser._id !== auth._id
      ) {
        toast({
          title: "Only admins can Add or Remove Someone",
          description: "Failed to Load the Search Results",
          statue: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        return;
      }
      const { data } = await axiosPrivate.put(`/api/chat/removeFromgroup`, {
        chatId: selectedChat._id,
        userId: deluser._id,
      });
      deluser._id === auth._id ? setSelectedChat() : setSelectedChat(data);
      setfetch(!fetch);
      fetchMsg();
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: err.response.data.message,
        status: "error",
        duration: 500,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleAdd = async (adduser) => {
    setLoading(true);
    try {
      if (selectedChat.users.find((u) => u._id === adduser._id)) {
        toast({
          title: "User Already Added",
          description: "Failed to Load the Search Results",
          statue: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        return;
      }
      if (selectedChat.groupAdmin._id !== auth._id) {
        toast({
          title: "Only admins can Add or Remove Someone",
          description: "Failed to Load the Search Results",
          statue: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axiosPrivate.put(`/api/chat/AddTogroup`, {
        chatId: selectedChat._id,
        userId: adduser._id,
      });
      setSelectedChat(data);
      setfetch(!fetch);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: err.response.data.message,
        status: "error",
        duration: 500,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupName) return;
    try {
      setRenameloading(true);
      const { data } = await axiosPrivate.put("/api/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupName,
      });
      console.log(data);
      setSelectedChat(data);
      setfetch(!fetch);
      setRenameloading(false);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: err.response.data.message,
        status: "error",
        duration: 500,
        isClosable: true,
        position: "top",
      });
      console.log(err);
      setRenameloading(false);
    }
    setgroupName("");
  };

  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const { data } = await axiosPrivate.get(`/api/user?search=${search}`);
      setLoading(false);
      setsearchresult(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        statue: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <IconButton
        d={{ base: "flex" }}
        icon={<ViewIcon></ViewIcon>}
        onClick={onOpen}
      >
        Update
      </IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"1.7rem"}
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap={"wrap"}>
              {selectedChat.users.map((u) => (
                <BadgeUser
                  key={u._id}
                  user={u}
                  handle={() => handleremove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupName}
                onChange={(e) => setgroupName(e.target.value)}
              ></Input>
              <Button
                variant="solid"
                colorScheme={"yellow"}
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <Input
              placeholder="Add user to group"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            ></Input>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handlefunc={() => handleAdd(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={"red"}
              mr={3}
              onClick={() => handleremove(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpDateGroup;
