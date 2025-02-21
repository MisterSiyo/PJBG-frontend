import styles from '../styles/project.module.css';
import Header from '../components/Header';


export default function Project() {
    return (
        <div className={styles.projectPage}>
            <Header />
            <h1>Project Page</h1>
        </div>
    );
}
