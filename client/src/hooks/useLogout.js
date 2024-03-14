import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import { ChatState } from '../Context/ChatProvider';

const useLogout = () => {
  const { setAuth } = ChatState();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axiosPrivate.get('/api/v1/user/logout', {
        withCredentials: true,
      });
      setAuth({});
      localStorage.removeItem('Info');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
