import { Container, Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={'white'}
        color={'Black'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      >
        <Box fontSize="xl" textTransform="uppercase" color="rgba(255, 166, 0, 1)" fontFamily={'cursive'}>
          Vibe&apos;n
        </Box>
      </Box>
      <Box p={4} bg={'white'} color={'white'} w="100%" m="40px 0 15px 0" borderRadius="lg">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%" _focus={{ boxShadow: '0' }} _selected={{ bg: 'grey', color: 'white' }}>
              Login
            </Tab>
            <Tab width="50%" _focus={{ boxShadow: '0' }} _selected={{ bg: 'grey', color: 'white' }}>
              Sign-up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
