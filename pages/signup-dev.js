import styles from '../styles/auth.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import SiretCheck from '../components/SiretCheck';
import UserForm from '../components/userForm';

export default function SignupDev() {
    const router = useRouter();

    return (
        <div className={styles.authContainer}>
            <h2>Inscription Développeur</h2>
            <SiretCheck />
            <UserForm onSubmit={() => router.push('/')} />
        </div>
    );
}
