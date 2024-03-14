import { Outlet } from 'react-router-dom';

import { useState, useEffect } from 'react';
import useRefreshToken from '../../hooks/useRefreshToken';
import { ChatState } from '../../Context/ChatProvider';
import Loading from './Loading';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = ChatState();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return <>{isLoading ? <Loading size={'6xl'} /> : <Outlet />}</>;
};

export default PersistLogin;
