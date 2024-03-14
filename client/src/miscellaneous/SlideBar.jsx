import { useState } from 'react';
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
} from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/menu';
import UserList from '../User/UserList';
import ChatLoading from './ChatLoading';
import { Tooltip } from '@chakra-ui/tooltip';
import { BellIcon, ChevronDownIcon, Search2Icon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import ProfileModel from './ProfileModel';
import { ChatState } from '../Context/ChatProvider';
import { Button } from '@chakra-ui/react';
import { getSender } from '../config/ChatAbout';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useLogout from '../hooks/useLogout';

function SlideBar() {
  const [search, setSearch] = useState('');
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { auth, setSelectedChat, chats, setchats, notification, setNotification } = ChatState();
  const axiosPrivate = useAxiosPrivate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logout = useLogout();

  const logoutHandler = () => {
    logout();
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter name or email id of the person that you want to find',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
    try {
      setloading(true);

      const { data } = await axiosPrivate.get(`/api/v1/user?search=${search}`);
      setloading(false);
      setsearchResult(data);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        descritption: 'Failed to load the search Results',
        status: 'error',
        duration: '5000',
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const access_Chat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axiosPrivate.post(`/api/v1/chat`, { userId });

      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: 'Error fetching chat',
        description: err.message,
        statue: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#2D3748"
        w="100%"
        color="#F7FAFC"
        _hover={{ color: '#1A202C' }}
        p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" _active={{ color: '#1A202C' }} _hover={{ color: '#1A202C' }} onClick={onOpen}>
            <Search2Icon color="#F7FAFC" />
            <Text display={{ base: 'none', md: 'flex' }} color="#F7FAFC" px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontWeight={'bold'} color={'#F7FAFC'}>
          VIBE&apos;N
        </Text>
        <Box>
          <Menu>
            <MenuButton p={1}>
              <Box px={{ base: '1px', md: '5px' }} color={'#F7FAFC'}>
                <BellIcon fontSize={'2xl'} m={1} />
              </Box>
            </MenuButton>
            <MenuList>
              <Box p="5px 10px 5px 10px">
                {!notification.length && 'No new Messages'}
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
                      : `Got Message from ${getSender(auth, n.chat.users)}`}
                  </MenuItem>
                ))}
              </Box>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={auth?.name} src={auth?.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel auth={auth}>
                <MenuItem color="#171923"> My Profile</MenuItem>{' '}
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} color="#171923">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
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
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SlideBar;
