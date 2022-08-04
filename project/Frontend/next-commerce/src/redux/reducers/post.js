const init_state = {
  value: false,
};

import post_types from "./types/post";

const post_reducer = (state = init_state, action) => {
  if (action.type == post_types.POST_RENDER) {
    return {
      ...state,
      value: action.payload.value,
    };
  }
  return state;
};

export default post_reducer;
