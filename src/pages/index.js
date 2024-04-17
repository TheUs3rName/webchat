import styles from "@/styles/Home.module.css";

export default function Home() {
  return <div className={styles.main}></div>;
}

export async function getServerSideProps({ req }) {
  console.log(req.headers);
  return {props: {}}
}
