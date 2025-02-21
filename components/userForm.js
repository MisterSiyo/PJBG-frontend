import styles from '../styles/auth.module.css';
import { useState } from 'react';

export default function SignupForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        verifyPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (formData.password !== formData.verifyPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className={styles.authContainer}>
            <h2>Créer un compte</h2>
            
            <div className={styles.divider}></div>

            <label>Email:</label>
            <input className={styles.authInput} type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Username:</label>
            <input className={styles.authInput} type="text" name="username" value={formData.username} onChange={handleChange} required />

            <div className={styles.divider}></div>

            <label>Password:</label>
            <input className={styles.authInput} type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Verify Password:</label>
            <input className={styles.authInput} type="password" name="verifyPassword" value={formData.verifyPassword} onChange={handleChange} required />

            <button className={styles.authButton} onClick={handleSubmit}>Valider</button>
        </div>
    );
}
