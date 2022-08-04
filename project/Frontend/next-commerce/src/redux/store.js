import { combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import auth_reducer from "./reducers/auth";
import thunk from "redux-thunk";
import post_reducer from "./reducers/post";

const rootReducer = combineReducers({
  auth: auth_reducer,
  post: post_reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

//middleware ? action => reducer. action => function
// action => dispatch => mengubah state

// const store = configureStore({
//   reducer: rootReducer,
// });

export default store;
