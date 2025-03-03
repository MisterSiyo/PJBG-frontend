import styles from "../styles/layout.module.css";
import Header from "../components/Header";
import ProjectInfo from "../components/ProjectInfo";
import Home from "../components/Home";
import Preferences from "../components/preferences";

export default function Index() {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <Home />
      <Preferences />
    </div>
  );
}
