import axios from "../api/axios";
import { ChatState } from "../Context/ChatProvider";

const useRefreshToken = () => {
  const { setAuth } = ChatState();
  const refresh = async () => {
    const { data } = await axios.get("/api/user/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return { ...prev, accessToken: data?.accessToken };
    });
    return data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
