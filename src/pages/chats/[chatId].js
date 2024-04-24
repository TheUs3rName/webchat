import { getCookies } from "@/utils/cookies";
import React, { useState } from "react";
import styles from "@/styles/Chat.module.css";
import ChatHistory from "@/components/module/ChatHistory";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FaArrowUp } from "react-icons/fa";
import { ReadyState } from "react-use-websocket";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import useWebSocket from "react-use-websocket";
import { ConnectionReady, getReadyState } from "@/utils/webSocket";
import ConnectingLoader from "@/components/module/ConnectingLoader";
import toast, { Toaster } from "react-hot-toast";
import { EMPTY_MESSAGE, POS } from "@/utils/messages";
import { chatExists } from "@/services/httpClient";

function index({ token }) {
  const [text, setText] = useState("");
  const chats = useSelector((chats) => chats.chat.chatList);
  const { chatId } = useRouter().query;
  const selectedChat = chats.find((c) => c._id === chatId);

  const ws = useWebSocket(`ws://localhost:3001/ws/chats/${chatId}`, {
    heartbeat: {
      message: `{"action": "ping"}`,
      returnMessage: `{"action": "pong"}`,
      timeout: 60000, // 1 minute, if no response is received, the connection will be closed
      interval: 5000, // every 25 seconds, a ping message will be sent
    },
    shouldReconnect: () => true,
    reconnectInterval: 1000,
  });

  const { sendJsonMessage, lastJsonMessage, readyState } = ws;

  const sendHandler = () => {
    const data = {
      action: "message",
      chat: chatId,
      message: { text, from_user: token },
    };
    text
      ? sendJsonMessage(data, true)
      : toast.error(EMPTY_MESSAGE, { position: POS });
  };

  return (
    <div className={styles.chat}>
      <Toaster />
      <div className={styles.title}>
        <span>
          <Link href={`/profile/${selectedChat?.owner}`}>
            <MdAccountCircle />
          </Link>
          <h4>{selectedChat?.name}</h4>
        </span>
        <FaSearch />
      </div>
      <ChatHistory ws={ws} />
      <div className={styles.sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="type a message ..."
        />
        <button onClick={sendHandler} disabled={!ConnectionReady(readyState)}>
          {ConnectionReady(readyState) ? <FaArrowUp /> : <ConnectingLoader />}
        </button>
      </div>
    </div>
  );
}

export default index;
export async function getServerSideProps({ req }) {
  const { token } = getCookies(req);
  if (!token) {
    return { redirect: { destination: "/auth/signin", permenant: false } };
  }
  return { props: { token } };
}
