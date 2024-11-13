import { createSlice } from "@reduxjs/toolkit";

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
export default chatSlice.reducer;
