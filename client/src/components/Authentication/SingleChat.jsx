import { useEffect, useState, useRef } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';

import { ArrowBackIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { getSender, getSenderObject } from '../../config/ChatAbout';
import ProfileModal from '../../miscellaneous/ProfileModel';
import UpDateGroup from '../../miscellaneous/UpDateGroup';
import ScrollableBox from '../../User/ScrollableBox';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { socket } from '../../socket/socket';
let selectedChatCompare;
const SingleChat = ({ fetch, setfetch }) => {
  const axiosPrivate = useAxiosPrivate();
  const [msg, setMsg] = useState([]);
  const [replyingTo, setReplyingTo] = useState();
  const [loading, setLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [socketconnection, setSocketconnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { auth, selectedChat, setSelectedChat, notification, setNotification, setIsNotified } = ChatState();

  const toast = useToast();
  const componentRef = useRef(null);

  useEffect(() => {
    // Scroll to the end of the component
    if (componentRef.current) {
      const componentNode = componentRef.current;
      componentNode.scrollTop = componentNode.scrollHeight;
    }
  });

  const fetchMsg = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(`/api/v1/message/${selectedChat._id}`);
      setLoading(false);
      setMsg(data);
      socket.emit('joinRoom', selectedChat._id);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        status: 'Failed to Fetch the message',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  const sendMsg = async (e) => {
    if (e.key === 'Enter' && newMsg) {
      socket.emit('typing stopped', selectedChat._id);

      try {
        setNewMsg('');
        const body = {
          content: newMsg,
          chatId: selectedChat._id,
        };

        if (replyingTo?._id) {
          body.replyingTo = replyingTo._id;
        }
        const { data } = await axiosPrivate.post('/api/v1/message', body);

        socket.emit('newMsg', data);
        setMsg([...msg, data]);
        setReplyingTo(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchMsg();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.emit('setup', auth);

    socket.on('connected', () => {
      setSocketconnection(true);
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('typing stopped', () => setIsTyping(false));
    return () => {
      //clean up
      socket.off('connected', () => {
        setSocketconnection(false);
      });
      socket.off('typing', () => setIsTyping(true));
      socket.off('typing stopped', () => setIsTyping(false));
    };
  }, []);

  useEffect(() => {
    socket.on('got the msg', (newMsgrecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMsgrecieved.chat._id) {
        if (!notification.includes(newMsgrecieved)) {
          setIsNotified(true);
          setNotification([newMsgrecieved, ...notification]);
          setfetch(!fetch);
        }
      } else {
        setMsg([...msg, newMsgrecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMsg(e.target.value);
    if (!socketconnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTyping = new Date().getTime();
    var time_len = 3000;
    setTimeout(() => {
      var time = new Date().getTime();
      var timediff = time - lastTyping;
      if (timediff >= time_len && typing) {
        socket.emit('typing stopped', selectedChat._id);
        setTyping(false);
      }
    }, time_len);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            width="100%"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
            ref={componentRef}
            color="#A0AEC0"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(auth, selectedChat.users)}
                <ProfileModal auth={getSenderObject(auth, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpDateGroup fetch={fetch} setfetch={setfetch} fetchMsg={fetchMsg} />
              </>
            )}
          </Text>
          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg={'#4A5568'}
            borderRadius={'lg'}
            width={'100%'}
            height={'100%'}
            overflowY={'clip'}
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf={'center'} margin={'auto'} />
            ) : (
              <ScrollableBox componentRef={componentRef} msg={msg} setReplyingTo={setReplyingTo} />
            )}
            <FormControl onKeyDown={sendMsg} isRequired mt={3}>
              {isTyping ? <Text color="">Typing...</Text> : <></>}
              {replyingTo && (
                <Box p={3} bg="#718096" mb={2} borderRadius={'5px'} color="#F7FAFC">
                  <Text fontWeight="bold">Replying to :</Text> {replyingTo?.content}
                  <SmallCloseIcon boxSize={9} mx={2} cursor="pointer" onClick={() => setReplyingTo(null)} />
                </Box>
              )}
              <Input
                variant={'filled'}
                bg={'#F7FAFC'}
                color={'#2D3748'}
                _hover={{ backgroundColor: '#F7FAFC' }}
                _focus={{ backgroundColor: '#F7FAFC' }}
                border="none"
                placeholder="enter a message.."
                onChange={typingHandler}
                value={newMsg}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display={'flex'} alignItems="center" justifyContent={'center'} height="100%">
          <Text fontSize={'3xl'} pb={3} color="#F7FAFC">
            Click on a user to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
