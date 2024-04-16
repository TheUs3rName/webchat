import { configureStore } from "@reduxjs/toolkit";
import chat from "@/redux/chatSlice";

const store = configureStore({
  reducer: { chat },
});

export default store;
