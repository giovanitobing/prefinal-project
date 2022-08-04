import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import jsCookie from "js-cookie";
import auth_types from "../redux/reducers/types/auth";
import { axiosInstance } from "../lib/api";

const AuthProvider = ({ children }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   // const savedUserData = localStorage.getItem("user_data")
  //   // const savedUserData = jsCookie.get("user_data");

  //   const fetchdata = async() => {
  //     const userToken = jsCookie.get("auth_token")

  //     if (userToken) {
  //       const userResponse = await axiosInstance.get("/user/refresh-token",{
  //         headers:{
  //           authorization : userToken
  //         }
  //       })

  //   // if (savedUserData) {
  //   //   const parsedUserData = JSON.parse(savedUserData);

  //     dispatch({
  //       type: auth_types.AUTH_LOGIN,
  //       // payload: parsedUserData,
  //       payload: userResponse.data.result.user,
  //     })
  //   }

  //   setIsAuthChecked(true);
  // } fetchdata()
  // },[])
  useEffect(() => {
    const fetchdata = async () => {
      const userToken = jsCookie.get("auth_token");

      if (userToken) {
        const userResponse = await axiosInstance.get("/user/refresh-token", {
          headers: {
            authorization: userToken,
          },
        });
        // console.log(userResponse);

        if (userResponse) {
          dispatch({
            type: auth_types.AUTH_LOGIN,
            payload: userResponse.data.result.user,
          });
        } else {
          dispatch({
            type: auth_types.AUTH_LOGOUT,
          });
        }
      }
      setIsAuthChecked(true);
    };
    fetchdata();
  }, []);

  if (!isAuthChecked) return <div>Loading...</div>;

  return children;
};

export default AuthProvider;
