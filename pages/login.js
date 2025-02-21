import styles from '../styles/auth.module.css';
import Header from '../components/Header';
import ProjectInfo from '../components/ProjectInfo';

export default function Login() {
    return (
        <div className={styles.authContainer}>
            <Header />
            <h2>Top Projects</h2>
            
            <div>
                <ProjectInfo />
                <ProjectInfo />
                <ProjectInfo />
                <ProjectInfo />
            </div>
        </div>
    );
}
