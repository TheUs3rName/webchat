import { getChatList } from "@/services/httpClient";
import styles from "@/styles/Aside.module.css";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { MdAccountCircle } from "react-icons/md";
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
      {isLoading ? <Loader /> : null}
      <Link href="/profile">
        <span>
          <MdAccountCircle />
        </span>
      </Link>
    </div>
  );
}

export default Aside;
