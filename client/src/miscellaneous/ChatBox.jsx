import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from '../components/Authentication/SingleChat';

const ChatBox = ({ fetch, setfetch }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems={'center'}
      flexDir="column"
      p={3}
      bg={'white'}
      width={{ base: '100%', md: '68%' }}
      borderRadius={'lg'}
      borderWidth={'1px'}
    >
      <SingleChat fetch={fetch} setfetch={setfetch} />
    </Box>
  );
};

export default ChatBox;
