import axios from "../api/axios";
import { ChatState } from "../Context/ChatProvider";

const useRefreshToken = () => {
  const { setAuth } = ChatState();
  const refresh = async () => {
    const response = await axios.get("/api/user/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
