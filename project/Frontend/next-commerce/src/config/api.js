import axios from "axios";
import jsCookie from "js-cookie";
// import auth_style from "../redux/reducer/types";
// import store from "../redux/reducer/store";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:2000/",
});

axiosInstance.interceptors.request.use((config) => {
  async function setting() {
    config.headers.authorization = jsCookie.get("auth_token");
  }
  setting();

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status == 419) {
      jsCookie.remove("auth_token");

      store.dispatch({
        type: auth_style.AUTH_LOGOUT,
      });
    }

    return err;
  }
);
