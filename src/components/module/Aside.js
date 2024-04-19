import { getChatList } from "@/services/httpClient";
import styles from "@/styles/Aside.module.css";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { MdAccountCircle } from "react-icons/md";
import { FcNext } from "react-icons/fc";

import Loader from "./Loader";

function Aside() {
  const { data, isLoading } = useQuery({
    queryKey: ["getChats"],
    queryFn: getChatList,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className={styles.aside}>
      <input type="text" placeholder="serach" />
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.chat_list}>
          <ul>
            {data.map((chat) => (
              <li className={styles.chat} key={chat._id}>
                <span>
                  <div className={styles.blink}></div>
                  <h5>{chat.name}</h5>
                </span>
                <FcNext />
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link href="/profile">
        <span>
          <MdAccountCircle />
        </span>
      </Link>
    </div>
  );
}

export default Aside;
