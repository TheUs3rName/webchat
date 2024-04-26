import { getCookies } from "@/utils/cookies";
import React, { useState } from "react";
import styles from "@/styles/Chat.module.css";
import ChatHistory from "@/components/module/ChatHistory";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FaArrowUp } from "react-icons/fa";
import { MD5 } from "crypto-js";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import useWebSocket from "react-use-websocket";
import { ConnectionReady, getReadyState } from "@/utils/webSocket";
import ConnectingLoader from "@/components/module/ConnectingLoader";
import toast, { Toaster } from "react-hot-toast";
import { EMPTY_MESSAGE, POS } from "@/utils/messages";
import { chatExists, whoAmI } from "@/services/httpClient";

function index({ token, whoami }) {
  const [text, setText] = useState("");
  const chats = useSelector((chats) => chats.chat.chatList);
  const { chatId } = useRouter().query;
  const selectedChat = chats.find((c) => c._id === chatId);
  const [history, setHistory] = useState([]);

  const newMessageHandler = (m) => {
    const data = JSON.parse(m.data);
    if (
      data.action === "message" &&
      data.message.from_user.email !== whoami.email
    ) {
      setHistory((history) => [...history, data]);
    }
  };

  const sendHandler = () => {
    const data = {
      date: Date.now(),
      action: "message",
      chat: chatId,
      message: { text, from_user: whoami },
    };

    const messageId = MD5(JSON.stringify(data)).toString();
    data.id = messageId;

    if (text) {
      sendJsonMessage(data, true);
      setText("");
      setHistory((history) => [...history, data]);
    } else {
      toast.error(EMPTY_MESSAGE, { position: POS });
    }
  };

  const enterHandler = (e) => {
    e.key === "Enter" && sendHandler();
  };

  const ws = useWebSocket(`ws://localhost:3001/ws/chats/${chatId}`, {
    heartbeat: {
      message: `{"action": "ping"}`,
      returnMessage: `{"action": "pong"}`,
      timeout: 60000, // 1 minute, if no response is received, the connection will be closed
      interval: 5000, // every 25 seconds, a ping message will be sent
    },
    shouldReconnect: () => true,
    reconnectInterval: 1000,
    onMessage: newMessageHandler,
  });

  const { sendJsonMessage, lastJsonMessage, readyState } = ws;

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
      <div className={styles.history}>
        <ChatHistory
          ws={ws}
          history={history}
          setHistory={setHistory}
          whoami={whoami}
        />
      </div>
      <div className={styles.sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="type a message ..."
          onKeyPress={enterHandler}
        />
        <button
          onClick={sendHandler}
          disabled={!ConnectionReady(readyState)}
          onKeyPress={enterHandler}
        >
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
  const whoami = await whoAmI(token);
  return { props: { token, whoami } };
}
