import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserList = ({ user, handlefunc }) => {
  return (
    <Box
      onClick={handlefunc}
      cursor="pointer"
      bg="#e8e8e8"
      _hover={{ background: "#fcd12a", color: "white" }}
      w="100%"
      d="flex"
      alignItems={"center"}
      color={"black"}
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email:</b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserList;
