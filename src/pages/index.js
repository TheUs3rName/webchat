import styles from "@/styles/Home.module.css";
import { FcNext } from "react-icons/fc";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.section}>
        <h5>select the chat with click on</h5>
        <FcNext />
      </div>
    </div>
  );
}
