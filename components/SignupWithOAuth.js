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
      <h3 className={styles.titleSection}>Sign Up Options</h3>

      <div className={styles.divider}></div>

      <button
        className={styles.authButtonReddit}
        onClick={() => alert("Inscription via Reddit en cours...")}
      > 
      With Reddit
      </button>
      <br></br>

      <button
        className={styles.authButtonGoogle}
        onClick={() => alert("Inscription via Google en cours...")}
      >
        With Google
      </button>

      <br></br>
    </div>
  );
}
