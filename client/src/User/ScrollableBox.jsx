import { Avatar, Flex, Stack, Tooltip, Box } from '@chakra-ui/react';

import { isLastMsg, isSameSenderMargin, isSameUser, isSender } from '../config/ChatAbout';
import '../App.css';
import { ChatState } from '../Context/ChatProvider';

const ScrollableBox = ({ componentRef, msg, setReplyingTo }) => {
  const { auth } = ChatState();
  return (
    <Stack overflowY={'scroll'} ref={componentRef}>
      {msg &&
        msg.map((m, i) => (
          <>
            {m?.replyingTo && (
              <>
                <Flex
                  marginLeft={m.sender._id === auth._id ? 'auto' : '50'}
                  marginRight={m.sender._id === auth._id ? '10' : 'auto'}
                >
                  <Tooltip label={m?.replyingTo?.sender.name} placement="bottom-start" hasArrow>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      name={m?.replyingTo?.sender.name}
                      src={m?.replyingTo?.sender.pic}
                    />
                  </Tooltip>
                  <Box
                    bg={m?.replyingTo.sender._id === auth._id ? '#f5f5f5' : '#1A202C'}
                    color={m?.replyingTo.sender._id === auth._id ? '#1A202C' : '#F7FAFC'}
                    borderRadius="20px"
                    padding="5px 15px"
                  >
                    {m?.replyingTo.content}
                  </Box>
                </Flex>
              </>
            )}

            <div style={{ display: 'flex' }} key={m._id}>
              {(isSender(msg, m, i, auth._id) || isLastMsg(msg, i, auth._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar mt="7px" mr={1} size="sm" name={m.sender.name} src={m.sender.pic} />
                </Tooltip>
              )}

              <span
                style={{
                  backgroundColor: `${m.sender._id === auth._id ? '#f5f5f5' : '#1A202C'}`,
                  color: `${m.sender._id === auth._id ? '#1A202C' : '#F7FAFC'}`,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  cursor: 'pointer',
                  maxWidth: '75%',
                  marginLeft: isSameSenderMargin(msg, m, i, auth._id),
                  marginTop: isSameUser(msg, m, i, auth._id) ? 3 : 10,
                }}
                onDoubleClick={() => {
                  setReplyingTo(m);
                }}
              >
                {m.content}
              </span>
            </div>
          </>
        ))}
    </Stack>
  );
};

export default ScrollableBox;
