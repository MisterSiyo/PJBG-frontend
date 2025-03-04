'use client';
import styles from '../styles/layout.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setRole, addUserToStore, removeUserFromStore } from '../reducers/user';

export default function Header() {
    const [showPopover, setShowPopover] = useState(false); 
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const isLoggedIn = !!user.token;

    const router = useRouter();
    const isLoginPage = router.pathname === '/login';   
    const hideLoginButton = ['/signin-options', '/signup-user', '/signup-dev'].includes(router.pathname);

    const handleRoleSelection = (selectedRole, signupPath) => {
        dispatch(setRole(selectedRole));
        setShowPopover(false);
        router.push(signupPath);
    };

    const handleLogin = async () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!identifier || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const loginData = {
            email: emailRegex.test(identifier) ? identifier : undefined,
            username: !emailRegex.test(identifier) ? identifier : undefined,
            password
        };

        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    dispatch(addUserToStore(data));
                    setShowPopover(false);
                } else {
                    alert("Unknown error. Please try again.");
                }
            } else {
                alert(data.message || "An error has occurred.");
            }
        } catch (error) {
            alert("An error has occurred.");
        }
    };

    const handleLogout = () => {
        dispatch(removeUserFromStore());
        router.push('/');
    };

    return (
        <>
            <header className={styles.header}>
                {!isLoginPage && (
                    <button className={styles.backButton} onClick={() => router.back()}>⬅ Back</button>
                )}

                <h1 className={styles.title} onClick={() => router.push(isLoggedIn ? '/' : '/login')}>
                    PJBG
                </h1>

                {!hideLoginButton && (
                    isLoggedIn ? (
                        <div className={styles.userMenu}>
                            <span>Welcome, {user.username}!</span> 
                            <br /><br />
                            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <button className={styles.loginButton} onClick={() => setShowPopover(true)}>Login / Register</button>
                    )
                )}
            </header>

            {showPopover && (
                <div className={styles.popoverContainer} onClick={() => setShowPopover(false)}>
                    <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setShowPopover(false)}>×</button>

                        <h1>Log In</h1>
                        <button onClick={() => router.push('/signin-options')}>Log in with Reddit</button>
                        <br /><br />
                        <button onClick={() => router.push('/signin-options')}>Log in with Google</button>
                        <br /><br />
                        <h5>Or log in with your email or your username and your password :</h5>
                        <input type="text" placeholder="Email or Username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={styles.input} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
                        <br /><br />
                        <button onClick={handleLogin}>Enter</button>

                        <h1>Don't have an account?</h1>
                        <h4>Create one:</h4>
                        <button onClick={() => handleRoleSelection('patron', '/signup-user')}>I am a Patron</button>
                        <br /><br />
                        <button onClick={() => handleRoleSelection('studio', '/signup-dev')}>I'm a Game Studio</button>
                    </div>
                </div>
            )}
        </>
    );
}
