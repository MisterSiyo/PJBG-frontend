import styles from "../styles/auth.module.css";
import { useRouter } from "next/router";

export default function SignupWithOAuth() {
  const router = useRouter();

  const handleRedditSignup = () => {
    window.location.href = "/auth/reddit";
  };

  const handleGoogleSignup = () => {
    window.location.href = "/auth/google";
  };

  return (
    <div className={styles.authContainer}>
      <h3>Sign Up Options</h3>

      <button
        className={styles.authButton}
        onClick={() => alert("Inscription via Reddit en cours...")}
      >
        Sign Up with Reddit
      </button>

      <button
        className={styles.authButton}
        onClick={() => alert("Inscription via Google en cours...")}
      >
        Sign Up with Google
      </button>

      <h3 className={styles.separator}>or</h3>
    </div>
  );
}
