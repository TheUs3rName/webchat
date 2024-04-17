import styles from "@/styles/Layout.module.css";
import Aside from "@/components/module/Aside";

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Aside />
      {children}
    </div>
  );
}

export default Layout;
