import styles from "@/styles/Home.module.css";
import { FcNext } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.section__1}>
        <h5>select the chat with click on</h5>
        <FcNext />
      </div>
      <h3>Or</h3>
      <div className={styles.section__2}>
        <h5>create the new chat with click on</h5>
        <Link href={"/chats/new"}>
          <FaPlus />
        </Link>
      </div>
    </div>
  );
}
