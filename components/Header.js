import styles from '../styles/layout.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Login from './Login'

export default function Header() {
    const [showPopover, setShowPopover] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Ajout du state manquant
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const router = useRouter();
    const isLoginPage = router.pathname === '/login';
    const hideLoginButton = ['/signin-options', '/signup-user', '/signup-dev'].includes(router.pathname);

    // Gestion de la connexion
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);
                setIsLoggedIn(true);
                setShowPopover(false); // Ferme le popover après connexion
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Erreur de connexion :", error);
        }
    };

    // Gestion de la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        router.push('/'); // Redirige vers la page d'accueil après déconnexion
    };

    // Vérifie si l'utilisateur est connecté au chargement
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    
    return (
        <>
            <header className={styles.header}>
                {!isLoginPage && (
                    <button className={styles.backButton} onClick={() => router.back()}>⬅ Back</button>
                )}

                {/* Redirection conditionnelle en fonction de l'état connecté */}
                <h1 className={styles.title} onClick={() => router.push(isLoggedIn ? '/' : '/login')}>
                    PJBG
                </h1>

                {!hideLoginButton && (
                    isLoggedIn ? (
                        <div className={styles.userMenu}>
                            <span>Welcome, {localStorage.getItem('username')}!</span>
                            <br></br>
                            <br></br>
                            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <button className={styles.loginButton} onClick={() => setShowPopover(true)}>Login / Register</button>
                    )
                )}
            </header>


            {/* Popover Login / Register */}
            {showPopover && (
                <div className={styles.popoverContainer} onClick={() => setShowPopover(false)}>
                    <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setShowPopover(false)}>×</button>

                        <h1>Log In</h1>
                            <button onClick={() => router.push('/signin-options')}>Log in with Reddit</button>
                            <br></br>
                            <br></br>
                            <button onClick={() => router.push('/signin-options')}>Log in with Google</button>                       
                            <h5>Log in with your email & your password</h5>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input}/>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input}/>
                            <br></br>
                            <br></br>
                            <button className={styles.loginSubmit} onClick={handleLogin}>Enter</button>

                        <h1>Don't have an account?</h1>
                            <h4>Create one:</h4>
                            <button onClick={() => router.push('/signup-user')}>I am a Patron</button>
                            <br></br>
                            <br></br>
                            <button onClick={() => router.push('/signup-dev')}>I'm a Game Studio</button>
                    </div>
                </div>
            )}
        </>
    );
}
