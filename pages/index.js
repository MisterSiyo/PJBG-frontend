import styles from "../styles/layout.module.css";
import Header from "../components/Header";
import Home from "../components/Home";

export default function Index() {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <Home />
    </div>
  );
}
