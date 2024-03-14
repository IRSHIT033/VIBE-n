import { Container, Box, Center, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Center fontSize={'5xl'} color="#F7FAFC" p={3} m={6}>
        <h1>Vibe&apos;n</h1>
      </Center>
      <Box p={4} bg={'#718096'} color={'white'} w="100%" m="40px 0 15px 0" borderRadius="lg">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%" color="#1A202C" _selected={{ bg: '#171923', color: '#F7FAFC' }}>
              Login
            </Tab>
            <Tab width="50%" color="#1A202C" _selected={{ bg: '#171923', color: '#F7FAFC' }}>
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
