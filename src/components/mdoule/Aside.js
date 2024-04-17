import { getChatList } from "@/services/httpClient";
import styles from "@/styles/Aside.module.css";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ThreeDots } from "react-loader-spinner";

import { MdAccountCircle } from "react-icons/md";

function Loader() {
  return (
    <ThreeDots
      visible={true}
      height="80"
      width="80"
      color="#1E1F2B"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}

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
