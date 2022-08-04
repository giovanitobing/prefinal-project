const init_state = {
  id: "",
  username: "",
  email: "",
  full_name: "",
  bio: "",
  password: "",
  avatar_url: null,
};
import auth_types from "./types/auth";
function auth_reducer(state = init_state, action) {
  if (action.type === auth_types.AUTH_LOGIN) {
    return {
      ...state,
      id: action.payload.id,
      username: action.payload.username,
      email: action.payload.email,
      full_name: action.payload.full_name,
      bio: action.payload.bio,
      password: action.payload.password,
      avatar_url: action.payload.avatar_url,
    };
  } else if (action.type === auth_types.AUTH_LOGOUT) {
    return init_state;
  }

  return state;
}

export default auth_reducer;
