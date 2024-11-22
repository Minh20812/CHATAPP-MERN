import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    name: "",
    email: "",
    profilePic: "",
    token: "",
    onlineStatus: [],
    socketConnection: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    // setSocketConnection: (state, action) => {
    //   state.socketConnection = action.payload;
    // },
    setSocketConnection: (state, action) => {
      state.socketConnection = {
        isConnected: action.payload.isConnected,
        url: action.payload.url,
      };
    },
    setOnlineStatus: (state, action) => {
      state.onlineStatus = action.payload;
    },
    logout: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.profilePic = "";
      state.token = "";
      state.socketConnection = null;
    },
  },
});

export const {
  setUser,
  setToken,
  setSocketConnection,
  setOnlineStatus,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
