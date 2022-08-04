import jsCookie from "js-cookie";
import { axiosInstance } from "../../lib/api";
import auth_types from "../reducers/types/auth";
import qs from "qs";

export function userRegister(values, setSubmitting) {
  // kenapa di export diawal?
  return async function (dispatch) {
    try {
      // const res = await axiosInstance.get("/users", {
      //   params: {
      //     email: values.email,
      // password: values.password,

      let body = {
        email: values.email,
        username: values.username,
        password: values.password,
        full_name: values.full_name,
        bio: values.bio,
      };
      //   },
      // });

      console.log(body);

      const res = await axiosInstance.post(
        "/user/register",
        qs.stringify(body)
      );

      console.log(res);

      // const userData = res.data[0]; // memanggil data dengan index ke-0 dari db.json

      const userData = res.data.result.user;
      // const userData = res.data.result.user;
      const token = res.data.result.token;

      //   console.log(res.data);
      //   // if (!userData) {
      //   if (!res.data.result) {
      //     throw new Error("User not found");
      //   }

      // if (res.data[0].password !== values.password) {
      // if (userData.password !== values.password) {
      //   throw new Error("Wrong password");
      // }

      // const stringifiedUserData = JSON.stringify(userData);

      //   console.log(userData);

      // jsCookie.set("user_data", stringifiedUserData);
      jsCookie.set("auth_token", token);
      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: userData,
      });

      setSubmitting(false); // memberitahukan handle formiks function selesai

      //   toast({
      //     title: "Account Created",
      //     description: "We've created your account for you",
      //     status: "success",
      //     isClosable: true,
      //   });
    } catch (err) {
      console.log(err);

      setSubmitting(false);

      //   toast({
      //     title: "ERROR",
      //     description: err.toString(),
      //     status: "error",
      //     isClosable: true,
      //   });
    }
  };
}
