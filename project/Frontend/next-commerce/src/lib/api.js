import axios from "axios";
import jsCookie from "js-cookie";
import auth_types from "../redux/reducers/types/auth";
import store from "../redux/store";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:2000",

  // headers: {
  //   "x-secret-key": "abc",
  // },
});

axiosInstance.interceptors.request.use((config) => {
  async function setting() {
    config.headers.authorization = jsCookie.get("auth_token");
  }
  setting();

  return config;
});

// axiosInstance.interceptors.request.use((config) => {
//   // async function setting() {
//   //   config.headers.authorization = jsCookie.get("auth_token");
//   // }
//   // setting();

//   return config();
// });

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status == 419) {
      jsCookie.remove("auth_token"); // apabila expire

      store.dispatch({
        type: auth_types.AUTH_LOGOUT,
      });
    }
    return err;
  }
);
