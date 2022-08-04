// import jsCookie from "js-cookie";
// import { axiosInstance } from "../../lib/api";
// import auth_types from "../reducers/types/auth";
// import qs from "qs";

// export function userLogin(values, setSubmitting) {
//   // kenapa di export diawal?
//   return async function (dispatch) {
//     try {
//       // const res = await axiosInstance.get("/users", {
//       //   params: {
//       //     email: values.email,
//       // password: values.password,

//       let body = {
//         email: values.email,
//         username: values.email,
//         password: values.password,
//       };
//       //   },
//       // });

//       console.log(body);

//       const res = await axiosInstance.post("/user/login", qs.stringify(body));

//       console.log(res);

//       // const userData = res.data[0]; // memanggil data dengan index ke-0 dari db.json

//       const userData = res.data.result.user;
//       // const userData = res.data.result.user;
//       const token = res.data.result.token;

//       console.log(res.data);
//       // if (!userData) {
//       if (!res.data.result) {
//         throw new Error("User not found");
//       }

//       // if (res.data[0].password !== values.password) {
//       // if (userData.password !== values.password) {
//       //   throw new Error("Wrong password");
//       // }

//       // const stringifiedUserData = JSON.stringify(userData);

//       console.log(userData);

//       // jsCookie.set("user_data", stringifiedUserData);
//       jsCookie.set("auth_token", token);
//       dispatch({
//         type: auth_types.AUTH_LOGIN,
//         payload: userData,
//       });

//       setSubmitting(false); // memberitahukan handle formiks function selesai
//     } catch (err) {
//       console.log(err);

//       setSubmitting(false);
//     }
//   };
// }

// UPDATE...

import jsCookie from "js-cookie";
import { axiosInstance } from "../../lib/api";
import auth_types from "../reducers/types/auth";
import qs from "qs";
import axios from "axios";

export function userLogin(values, setSubmitting) {
  return async function (dispatch) {
    try {
      let body = {
        email: values.email,
        password: values.password,
        username: values.email,
        location: "",
        ip_address: "",
      };

      body.ip_address = (
        await axios.get("https://api.ipify.org/?format=json%22")
      ).data.ip;

      body.location = (
        await axios.get(`https://ipapi.co/${body.ip_address}/json/`)
      ).data.country_capital;

      // console.log(JSON.stringify(body));

      const res = await axiosInstance.post("/user/login", qs.stringify(body));

      const userData = res.data.result.user;
      const token = res.data.result.token;

      if (!res.data.result) {
        throw new Error("User not found");
      }

      // const stringifiedUserData = JSON.stringify(userData);

      // console.log(userData);

      jsCookie.set("auth_token", token);
      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: userData,
      });

      setSubmitting(false);
    } catch (err) {
      console.log(err);

      setSubmitting(false);
    }
  };
}
