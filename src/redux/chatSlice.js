import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatList: [],
  
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addOneChat: (state, payload) => {
      state.chatList.push(payload.payload);
    },

    addManyChat: (state, payload) => {
      state.chatList.push(...payload.payload);
    },
  },
});

export default chatSlice.reducer;
export const { addOneChat, addManyChat } = chatSlice.actions;
