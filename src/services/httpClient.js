import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (res) => res.data,
  (err) => err
);

const getChatList = async () => {
  const chatList = await httpClient.get("/chats");
  return chatList;
};

const signIn = async (data) => {
  const res = await httpClient.post("/auth/signin", data);
  return res;
};

export { getChatList, signIn };
export default httpClient;
