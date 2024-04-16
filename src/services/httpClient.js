import axios from "axios";

const API_URL = process.env.API_URL;
console.log("apiurl", API_URL, typeof API_URL);
const httpClient = axios.create({ baseURL: API_URL });

console.log(httpClient.defaults.baseURL);

httpClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

const getChatList = async () => {
  const chatList = await httpClient.get("/chats");
  return chatList;
};

export { getChatList };
export default httpClient;
