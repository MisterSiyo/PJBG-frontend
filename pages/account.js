import styles from '../styles/layout.module.css';
import Header from '../components/Header';
import Account from '../components/Account';

export default function account() {
    return (
        <div className={styles.mainContainer}>
            <Header />
            < Account/>
        </div>
    );
}