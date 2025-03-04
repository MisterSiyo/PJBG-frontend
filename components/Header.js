import styles from '../styles/layout.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Login from './Login'
import { useDispatch } from 'react-redux';
import { addUserToStore, removeUserFromStore } from '../reducers/user';

export default function Header() {
    const [showPopover, setShowPopover] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' ou 'username'

    const dispatch = useDispatch();
    
    const router = useRouter();
    const isLoginPage = router.pathname === '/login';
    const hideLoginButton = ['/signin-options', '/signup-user', '/signup-dev'].includes(router.pathname);

    // Gestion de la connexion
    const handleLogin = async () => {
        // Validation des champs
        if ((loginMethod === 'email' && !email) || (loginMethod === 'username' && !username) || !password) {
            alert("Please fill in all fields.");
            return;
        }
    
        try {
            // Préparation des données à envoyer
            const loginData = loginMethod === 'email' ? { email, password } : { username, password };
    
            // Log des données envoyées pour vérifier
            console.log("Données envoyées :", loginData);
    
            // Envoi de la requête
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
    
            // Vérifie la réponse brute avant de la parser
            const rawResponse = await response.text();  // Utilise `text()` pour obtenir la réponse brute
            console.log('Réponse brute:', rawResponse);
    
            // Essaie de parser la réponse en JSON seulement si la réponse est valide
            const data = JSON.parse(rawResponse);
    
            if (response.ok) {
                if (data.token) {
                    dispatch(addUserToStore(data))
                    setIsLoggedIn(true);
                    setShowPopover(false); // Ferme le popover après connexion
                } else {
                    alert("Erreur inconnue. Veuillez réessayer.");
                }
            } else {
                alert(data.message || "Une erreur est survenue");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            alert('Une erreur est survenue');
        }
    };

    // Gestion de la déconnexion
    const handleLogout = () => {
        dispatch(removeUserFromStore())
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

                        <br/>
                        <br/>
                        <input type="radio" name="loginMethod" value="email" checked={loginMethod === 'email'} onChange={() => setLoginMethod('email')}/>
                        <label>Login with email</label>
                        <br/>
                        <br/>
                        <input type="radio" name="loginMethod" value="username"  checked={loginMethod === 'username'} onChange={() => setLoginMethod('username')}/>
                        <label>Login with username</label>
                        <br/>
                        <br/>
                        {/* Affichage des input en fonction du choix */}
                        {loginMethod === 'email' ? (
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input}/>
                        ) : (
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input}/>
                        )}
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input}/>
                        <br/>
                        <br/>
                        <button onClick={handleLogin}>Enter</button>

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
