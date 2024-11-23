import { createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    activeConversationId: null,
    messages: [],
    typingStatus: {},
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setTypingStatus: (state, action) => {
      state.typingStatus[action.payload.userId] = action.payload.isTyping;
    },
  },
});

export const {
  setActiveConversation,
  addMessage,
  setMessages,
  setTypingStatus,
} = chatSlice.actions;

// Socket event listeners
export const initializeSocketEvents = (dispatch) => {
  if (!socket) {
    console.error("Socket is not initialized.");
    return;
  }

  socket.on("newMessage", (message) => {
    dispatch(addMessage(message));
  });

  socket.on("typingStatus", (data) => {
    dispatch(setTypingStatus(data));
  });
};

export default chatSlice.reducer;
