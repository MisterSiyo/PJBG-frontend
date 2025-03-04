import styles from '../styles/layout.module.css';
import Account from '../components/Account';

export default function account() {
    return (
        <div className={styles.mainContainer}>
            < Account/>
        </div>
    );
}