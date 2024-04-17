import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (res) => res.data,
  (err) => err.response.data
);

const getChatList = async () => {
  const chatList = await httpClient.get("/chats");
  return chatList;
};

const signIn = async (data) => {
  const res = await httpClient.post("/auth/signin", data);
  return res;
};

const signUp = async (data) => {
  const res = httpClient.post("/auth/signup", data);
  return res;
};

const whoAmI = async () => {
  const res = httpClient.get("/auth/whoami");
  return res;
};

export { getChatList, signIn, signUp, whoAmI };
export default httpClient;
