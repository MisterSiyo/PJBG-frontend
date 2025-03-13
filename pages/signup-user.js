import styles from '../styles/auth.module.css';
import { useRouter } from 'next/router';
import SignupWithOAuth from '../components/SignupWithOAuth';
import UserForm from '../components/userForm';

export default function SignupUser() {
    const router = useRouter();

    return (
        <div className={styles.authContainer}>
            <SignupWithOAuth />
            <h3>or</h3>
            <UserForm onSubmit={() => router.push('/')} />
        </div>
    );
}
