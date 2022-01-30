import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSms } from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Info"));
    if (user) history.push("/chats");
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        color={"Black"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      >
        <Text
          fontSize="4xl"
          textTransform="uppercase"
          fontFamily="Work sans"
          fontWeight="bold"
          color="rgba(255, 166, 0, 1)"
        >
          Chat-A-holic{" "}
          <FontAwesomeIcon id="sms-icon" icon={faSms}></FontAwesomeIcon>
        </Text>
      </Box>
      <Box
        p={4}
        bg={"white"}
        color={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab
              width="50%"
              _focus={{ boxShadow: "0" }}
              _selected={{ bg: "grey", color: "white" }}
            >
              Login
            </Tab>
            <Tab
              width="50%"
              _focus={{ boxShadow: "0" }}
              _selected={{ bg: "grey", color: "white" }}
            >
              Sign-up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>
                <Login />
              </p>
            </TabPanel>
            <TabPanel>
              <p>
                <Signup />
              </p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
