import { getCookies } from "@/utils/cookies";
import React, { useState } from "react";
import styles from "@/styles/Chat.module.css";
import ChatHistory from "@/components/module/ChatHistory";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FaArrowUp } from "react-icons/fa";

import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import useWebSocket from "react-use-websocket";
import { getReadyState } from "@/utils/webSocket";

function index({ token }) {
  const [text, setText] = useState("");
  const chats = useSelector((chats) => chats.chat.chatList);
  const { chatId } = useRouter().query;
  const selectedChat = chats.find((c) => c._id === chatId);

  const ws = useWebSocket(`ws://localhost:3001/ws/chats/${chatId}`, {
    heartbeat: {
      message: '{"action": "ping"}',
      timeout: 60000, // 1 minute, if no response is received, the connection will be closed
      interval: 5000, // every 25 seconds, a ping message will be sent
    },
    
    shouldReconnect: (e) => {
      console.log(e)
      return true
    }
  });

  const { sendJsonMessage, lastJsonMessage, readyState } = ws;
  console.log(getReadyState(readyState));

  const sendHandler = () => {
    const data = {
      action: "message",
      chat: chatId,
      message: { text, from_user: token },
    };
    sendJsonMessage(data, true);
  };

  return (
    <div className={styles.chat}>
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
        <button onClick={sendHandler}>
          <FaArrowUp />
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
