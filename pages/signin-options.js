import styles from '../styles/auth.module.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import SignIn from '../components/Login';

export default function SigninOptions() {
    const router = useRouter();

    return (
        <div className={styles.authContainer}>
            <Header />

            <h2>Sign In Options :</h2>

            <SignIn onSubmit={(formData) => {
                console.log('Connexion avec:', formData);
                router.push('/main');
            }} />
        </div>
    );
}
