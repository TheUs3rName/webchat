import styles from "@/styles/Layout.module.css";
import Aside from "@/components/mdoule/Aside";

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Aside />
      {children}
    </div>
  );
}

export default Layout;
