import styles from '../styles/auth.module.css';

export default function SignupWithOAuth() {
    return (
        <div className={styles.authContainer}>
            <h3>Sign Up Options</h3>

            <button 
                className={styles.authButton}
                onClick={() => alert('Inscription via Reddit en cours...')}
            >
                Sign Up with Reddit
            </button>
            
            <button 
                className={styles.authButton}
                onClick={() => alert('Inscription via Google en cours...')}
            >
                Sign Up with Google
            </button>

            <h3 className={styles.separator}>or</h3>
        </div>
    );
}
