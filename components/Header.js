import styles from '../styles/layout.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Login from './Login'

export default function Header() {
    const [showPopover, setShowPopover] = useState(false); // Pour afficher ou masquer le popover de connexion
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Pour savoir si l'utilisateur est connecté
    const [identifier, setIdentifier] = useState('');  // Email ou username pour la connexion
    const [password, setPassword] = useState(''); // Mot de passe pour la connexion
    
    const router = useRouter();  // Initialisation du routeur de Next.js
    const isLoginPage = router.pathname === '/login';   // Détection si la page actuelle est celle de la connexion
    const hideLoginButton = ['/signin-options', '/signup-user', '/signup-dev'].includes(router.pathname); // Détection si le bouton de connexion doit être masqué sur certaines pages

    // Fonction pour gérer la connexion de l'utilisateur
    const handleLogin = async () => {

        // Déclaration de l'expression régulière pour valider un email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

       // Validation de la présence de l'email/username et du mot de passe
        if (!identifier || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // Vérifie si l'identifier est un email ou un nom d'utilisateur
        const loginData = {
        email: emailRegex.test(identifier) ? identifier : undefined,  // Si l'identifier est un email
        username: !emailRegex.test(identifier) ? identifier : undefined, // Sinon, c'est un nom d'utilisateur
        password
        };

        // Envoi de la requête HTTP POST pour la connexion
        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Spécifie que le corps de la requête est du JSON
                body: JSON.stringify(loginData)  // Sérialisation des données en JSON
            });
    
            const data = await response.json();
      
            // Si la requête est réussie
            if (response.ok) {
                if (data.token) {
                    // Sauvegarde du token, du nom d'utilisateur et du rôle dans le localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('role', data.role);
                    setIsLoggedIn(true); // Met à jour l'état pour indiquer que l'utilisateur est connecté
                    setShowPopover(false); // Ferme le popover après la connexion réussie
                } else {
                    alert("Unknown error. Please try again.");
                }
            } else {
                alert(data.message || "An error has occurred.");
            }
        } catch (error) {
            alert("An error has occurred."); // Affiche une alerte si une erreur se produit lors de la connexion
        }
    };

     // Fonction pour gérer la déconnexion de l'utilisateur
    const handleLogout = () => {
        // Suppression des informations de connexion dans le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false); // Met à jour l'état pour indiquer que l'utilisateur est déconnecté
        router.push('/');  // Redirige l'utilisateur vers la page d'accueil après la déconnexion
    };

    // Effet qui s'exécute lors du montage du composant pour vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));  // Si un token est présent dans le localStorage, l'utilisateur est connecté
    }, []);


    return (
        <>
            <header className={styles.header}>
                {/* Si on n'est pas sur la page de connexion, on affiche un bouton pour revenir en arrière */}
                {!isLoginPage && (
                    <button className={styles.backButton} onClick={() => router.back()}>⬅ Back</button>
                )}

                <h1 className={styles.title} onClick={() => router.push(isLoggedIn ? '/' : '/login')}>
                    PJBG
                </h1>

                {/* Si le bouton de connexion ne doit pas être masqué */}
                {!hideLoginButton && (
                    isLoggedIn ? (
                        // Si l'utilisateur est connecté, on affiche un menu utilisateur avec son nom et un bouton de déconnexion
                        <div className={styles.userMenu}>
                            <span>Welcome, {localStorage.getItem('username')}!</span>
                            <br></br>
                            <br></br>
                            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        // Si l'utilisateur n'est pas connecté, on affiche un bouton pour afficher le popover de connexion
                        <button className={styles.loginButton} onClick={() => setShowPopover(true)}>Login / Register</button>
                    )
                )}
            </header>

            {/* Si showPopover est vrai, on affiche le popover de connexion */}
            {showPopover && (
                <div className={styles.popoverContainer} onClick={() => setShowPopover(false)}>
                    {/* On empêche la propagation du clic pour ne pas fermer le popover quand on clique à l'intérieur */}
                    <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
                        {/* Bouton pour fermer le popover */}
                        <button className={styles.closeButton} onClick={() => setShowPopover(false)}>×</button>

                        {/* Boutons pour se connecter via Reddit ou Google */}
                        <h1>Log In</h1>
                        <button onClick={() => router.push('/signin-options')}>Log in with Reddit</button>
                        <br></br>
                        <br></br>
                        <button onClick={() => router.push('/signin-options')}>Log in with Google</button>    
                        <br/>
                        <br/>
                        {/* Section pour se connecter avec email ou username */}
                        <h5> Or log in with your email or your username and your password :</h5>
                        <input type="text" placeholder="Email or Username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={styles.input}/>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input}/>
                        <br/>
                        <br/>
                        <button onClick={handleLogin}>Enter</button>

                        {/* Si l'utilisateur n'a pas de compte, on lui propose de s'inscrire */}
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
