import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/Chat.module.css";
import { useRouter } from "next/router";

function ChatHistory({ ws, history, setHistory, whoami }) {
  const { chatId } = useRouter().query;
  const { sendJsonMessage, lastJsonMessage, readyState } = ws;

  useEffect(() => {
    if (lastJsonMessage?.history) {
      setHistory((history) => [...history, ...lastJsonMessage.history]);
    }
  }, [lastJsonMessage]);

  return (
    <div className={styles.history}>
      {!!history.length ? (
        history.map((m) => (
          <div
            className={
              m.message.from_user.email === whoami.email
                ? styles.sender
                : styles.receiver
            }
            key={m.id}
          >
            <span>
              <p>{m.message.text}</p>
              <p
                className={
                  m.message.from_user.email === whoami.email
                    ? styles.sender__timestamp
                    : styles.receiver__timestamp
                }
              >
                {new Date(+m.date).getHours()}:{new Date(+m.date).getMinutes()}
              </p>
            </span>
          </div>
        ))
      ) : (
        <h5>No Messages here yet.</h5>
      )}
    </div>
  );
}

export default ChatHistory;
