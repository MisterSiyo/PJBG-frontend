import styles from '../styles/layout.module.css';
import Header from '../components/Header';
import ProjectInfo from '../components/ProjectInfo';

export default function Main() {
    return (
        <div className={styles.mainContainer}>
            <Header />
            <h2>Projets Disponibles</h2>

            <div>
                <ProjectInfo />
                <ProjectInfo />
                <ProjectInfo />
                <ProjectInfo />
            </div>
        </div>
    );
}
