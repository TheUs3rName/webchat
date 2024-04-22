import React, { useEffect, useState } from "react";
import styles from "@/styles/Chat.module.css";

function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className={styles.history}>chat history here</div>;
}

export default ChatHistory;
