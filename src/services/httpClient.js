import axios from "axios";

const httpClient = axios.create({
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (res) => res.data,
  (err) => err.response.data
);

const getChatList = async () => {
  const chatList = await httpClient.get("/api/chats");
  return chatList;
};

const signIn = async (data) => {
  const res = await httpClient.post("/api/auth/signin", data);
  return res;
};

const signUp = async (data) => {
  const res = httpClient.post("/api/auth/signup", data);
  return res;
};

const whoAmI = async (token) => {
  const res = await httpClient.get("/api/auth/whoami", {headers: {Cookie: `token=${token};`}})
  return res;
};

const chatExists = async (_id) => {
  const res = httpClient.get(`/api/chats/${_id}`);
  return res;
};

const createChat = async (data) => {
  const res = httpClient.post("/api/chats", data);
  return res;
};

export { getChatList, signIn, signUp, whoAmI, chatExists, createChat };
export default httpClient;
