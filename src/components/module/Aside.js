import { getChatList } from "@/services/httpClient";
import styles from "@/styles/Aside.module.css";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { addManyChat } from "@/redux/chatSlice";
import { useDispatch } from "react-redux";

import { MdAccountCircle } from "react-icons/md";
import { FcNext } from "react-icons/fc";

import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Aside() {
  const { data, isLoading } = useQuery({
    queryKey: ["getChats"],
    queryFn: getChatList,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    !isLoading && dispatch(addManyChat(data));
    if (search) {
      const filteredChats = data.filter((chat) =>
        chat.name.toLowerCase().includes(search.toLocaleLowerCase())
      );
      setFiltered(filteredChats);
    } else {
      setFiltered(data);
    }
  }, [isLoading, search]);

  const router = useRouter();

  const selectChatHandler = (_id) => {
    router.push(`/chats/${_id}`);
  };

  return (
    <div className={styles.aside}>
      <input
        type="text"
        placeholder="serach"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.chat_list}>
          <ul>
            {filtered?.map((chat) => (
              <li className={styles.chat} key={chat._id}>
                <span>
                  <div className={styles.blink}></div>
                  <h5>{chat.name}</h5>
                </span>
                <FcNext onClick={() => selectChatHandler(chat._id)} />
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
