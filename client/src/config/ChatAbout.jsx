export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderObject = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSender = (msg, m, i, userId) => {
  return (
    i < msg.length - 1 &&
    (msg[i + 1].sender._id !== m.sender._id || msg[i + 1].sender._id === undefined) &&
    msg[i].sender._id !== userId
  );
};

export const isLastMsg = (msg, i, userId) => {
  return i === msg.length - 1 && msg[msg.length - 1].sender._id !== userId && msg[msg.length - 1].sender._id;
};

export const isSameSenderMargin = (msg, m, i, userId) => {
  if (i < msg.length - 1 && msg[i + 1].sender._id === m.sender._id && msg[i].sender._id !== userId) return 33;
  else if (
    (i < msg.length - 1 && msg[i + 1].sender._id !== m.sender._id && msg[i].sender._id !== userId) ||
    (i === msg.length - 1 && msg[i].sender._id !== userId)
  )
    return 0;
  else return 'auto';
};

export const isSameUser = (msg, m, i) => {
  return i > 0 && msg[i - 1].sender._id === m.sender._id;
};
