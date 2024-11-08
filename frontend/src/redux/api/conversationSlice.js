import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedConversation: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    clearSelectedConversation: (state) => {
      state.selectedConversation = null;
    },
  },
});

export const { setSelectedConversation, clearSelectedConversation } =
  conversationSlice.actions;
export default conversationSlice.reducer;
