import styles from '../styles/layout.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
    const [showPopover, setShowPopover] = useState(false);
    const router = useRouter();

    const isLoginPage = router.pathname === '/login';
    const hideLoginButton = ['/signin-options', '/signup-user', '/signup-dev'].includes(router.pathname);

    return (
        <>
            <header className={styles.header}>
                {!isLoginPage && (
                    <button className={styles.backButton} onClick={() => router.back()}>⬅ Back</button>
                )}

                <h1 className={styles.title} onClick={() => router.push('/login')}>GameFunder</h1>

                {!hideLoginButton && (
                    <button className={styles.loginButton} onClick={() => setShowPopover(true)}>Login</button>
                )}
            </header>

            {/* Popover */}
            {showPopover && (
                <div className={styles.popoverContainer} onClick={() => setShowPopover(false)}>
                    <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setShowPopover(false)}>×</button>
                        <h3>Login Options</h3>
                        <button onClick={() => router.push('/signin-options')}>Sign In</button>
                        <button onClick={() => router.push('/signup-user')}>Sign Up User</button>
                        <button onClick={() => router.push('/signup-dev')}>Sign Up Dev</button>
                    </div>
                </div>
            )}
        </>
    );
}
