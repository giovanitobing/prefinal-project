import { axiosInstance } from "../../lib/api";
import qs from "qs";
import auth_types from "../reducers/types/auth";

export function userEdit(values, setSubmitting) {
  return async function (dispatch) {
    try {
      // let body = {
      //   full_name: values.full_name,
      //   username: values.username,
      //   bio: values.bio,
      //   email: values.email,
      //   avatar_url: values.avatar_url,
      // };

      const formData = new FormData();
      const { full_name, username, bio, email, avatar } = values;

      formData.append("full_name", full_name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("avatar", avatar);

      // const res = await axiosInstance.patch(
      //   `/user/editProfile/${values.id}`,
      //   qs.stringify(body)

      // );
      const res = await axiosInstance.patch(
        `user/edit-avatar/${values.id}`,
        formData
      );

      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: res,
      });

      // const res2 = await axiosInstance.patch(`/user/edit-avatar/${values.id}`);

      console.log(res);

      setSubmitting(false);
    } catch (err) {
      console.log(err);

      setSubmitting(false);
    }
  };
}
