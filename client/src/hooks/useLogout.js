import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ChatState } from '../Context/ChatProvider';

const useLogout = () => {
  const { setAuth } = ChatState();
  const navigate = useNavigate();
  const logout = async () => {
    setAuth({});
    try {
      await axios('/api/user/logout', {
        withCredentials: true,
      });
      localStorage.removeItem('Info');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
