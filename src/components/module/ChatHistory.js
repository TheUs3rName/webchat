import React, { useEffect, useState } from "react";
import styles from "@/styles/Chat.module.css";
import { useRouter } from "next/router";
import { getReadyState } from "@/utils/webSocket";
import useWebSocket from "react-use-websocket";

function ChatHistory({ ws }) {
  const [chatHistory, setChatHistory] = useState([]);
  const { chatId } = useRouter().query;

  const { sendJsonMessage, lastJsonMessage, readyState } = ws;

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    console.log("Fetch more list items!");
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    setChatHistory(lastJsonMessage?.history)
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.history}>
      {!!chatHistory?.length ? <p>chat history</p> : <p>nothing here..</p>}
    </div>
  );
}

export default ChatHistory;
