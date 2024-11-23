import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import apiSlice from "./api/apiSlice";
import authReducer from "./feature/authSlice";
import chatReducer from "./feature/chatSlice";
import userReducer from "./feature/userSlice";
import webSocketMiddleware from "./webSocketMiddleware";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra tuần tự hóa
    }).concat(apiSlice.middleware, webSocketMiddleware),
  devTools: true,
});

setupListeners(store.dispatch);

export default store;
