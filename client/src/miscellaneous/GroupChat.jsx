import { useState } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import BadgeUser from '../User/BadgeUser';
import UserList from '../User/UserList';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Loading from '../components/Authentication/Loading';

const GroupChat = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchresult, setSearchresult] = useState([]);
  const toast = useToast();
  const { chats, setchats } = ChatState();
  const axiosPrivate = useAxiosPrivate();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const { data } = await axiosPrivate.get(`/api/v1/user?search=${search}`);
      setLoading(false);
      setSearchresult(data);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        statue: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Pls fill all the fields',
        description: 'Failed to create a Group chat',
        statue: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const { data } = await axiosPrivate.post('/api/v1/chat/group', {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });
      setchats([data, ...chats]);
      onClose();
      toast({
        title: 'New group Created!',
        statue: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } catch (err) {
      toast({
        title: 'Failed to create the chat',
        description: err.response.data,
        statue: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleGroup = (Adduser) => {
    if (selectedUsers.includes(Adduser)) {
      toast({
        title: 'User Already Added',
        description: 'Failed to Load the Search Results',
        statue: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setselectedUsers([...selectedUsers, Adduser]);
  };

  const handleDel = (delUser) => {
    setselectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      {' '}
      <Box onClick={onOpen}>{children}</Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'35px'} d={'flex'} justifyContent={'center'}>
            Create group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir={'column'} alignItems={'center'}>
            <FormControl>
              <Input placeholder="Group Name" mb={3} onChange={(e) => setgroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder="Add your Friends" mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <BadgeUser
                  key={u._id}
                  user={u}
                  handle={() => {
                    handleDel(u);
                  }}
                />
              ))}
              {loading ? (
                <Loading size="xl" />
              ) : (
                searchresult
                  ?.slice(0, 4)
                  .map((user) => <UserList key={user._id} user={user} handlefunc={() => handleGroup(user)} />)
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button color="#F7FAFC" bg="#1A202C" _hover={{ backgroundColor: '#1A202C' }} mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChat;
