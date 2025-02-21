import styles from '../styles/auth.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import SignupWithOAuth from '../components/SignupWithOAuth';
import UserForm from '../components/userForm';

export default function SignupUser() {
    const router = useRouter();

    return (
        <div className={styles.authContainer}>
            <Header />
            <SignupWithOAuth />
            <UserForm onSubmit={() => router.push('/main')} />
        </div>
    );
}
