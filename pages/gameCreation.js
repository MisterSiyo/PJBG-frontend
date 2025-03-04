import styles from '../styles/layout.module.css';
import GameCreation from '../components/GameCreation';

export default function gameCreation() {
    return (
        <div className={styles.mainContainer}>
            <GameCreation />
        </div>
    );
}