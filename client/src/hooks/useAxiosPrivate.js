import React, { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { ChatState } from "../Context/ChatProvider";
import { axiosPrivate } from "../api/axios";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  const { auth } = ChatState();
  console.log(auth);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // when first time  user loggedIN and tried send a request
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        // after getting the forbidden error reusing the
        const prevRequest = error?.config;
        if (error?.response.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          // setting up the httpOnly cookie
          const newAccessToken = await refresh();
          console.log(newAccessToken);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
