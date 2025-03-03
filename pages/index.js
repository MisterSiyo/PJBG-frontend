import styles from "../styles/layout.module.css";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import Preferences from "../components/preferences";

export default function Index() {
  return (
    <div className={styles.mainContainer}>
      <Header />

      <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      <ProjectCard />
      <Preferences />
    </div>
  );
}
