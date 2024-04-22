import { getCookies } from "@/utils/cookies";
import React from "react";
import styles from "@/styles/Chat.module.css";
import ChatHistory from "@/components/module/ChatHistory";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FaArrowUp } from "react-icons/fa";

import { FaSearch } from "react-icons/fa";
import Link from "next/link";

function index() {
  const chats = useSelector((chats) => chats.chat.chatList);
  const { chatId } = useRouter().query;
  const selectedChat = chats.find((c) => c._id === chatId);
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
      <ChatHistory />
      <div className={styles.sendMessage}>
        <input placeholder="type a message ..." />
        <button>
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
