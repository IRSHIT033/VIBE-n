import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import SlideBar from '../miscellaneous/SlideBar';
import Chats from '../miscellaneous/Chats';
import ChatBox from '../miscellaneous/ChatBox';
const ChatPage = () => {
  const { auth } = ChatState();
  const [fetch, setfetch] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {auth && <SlideBar />}
      <Box display="flex" justifyContent={'space-between'} w="100vw" h="90vh" p="10px">
        {/*propagating refetch logic thid two component*/}
        {auth && <Chats fetch={fetch} />}
        {auth && <ChatBox fetch={fetch} setfetch={setfetch} />}
      </Box>
    </div>
  );
};
export default ChatPage;
