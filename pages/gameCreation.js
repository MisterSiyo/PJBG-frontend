import styles from '../styles/layout.module.css';
import Header from '../components/Header';
import GameCreation from '../components/GameCreation';

export default function gameCreation() {
    return (
        <div className={styles.mainContainer}>
            <Header />
            <GameCreation />
        </div>
    );
}