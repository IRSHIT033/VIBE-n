import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [auth,setAuth]=useState()
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setchats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("Info"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
  }, []);

  return (
    <ChatContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setchats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
