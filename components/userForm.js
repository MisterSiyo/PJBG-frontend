import styles from '../styles/auth.module.css';
import { useState } from 'react';

export default function SignupForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        verifyPassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        username: '',
    });

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    // Vérification en temps réel pour email et username
    if (name === 'email' && emailRegex.test(value)) {
        const response = await fetch(`http://localhost:3000/check-email?email=${value}`);
        const data = await response.json();
        setErrors((prevErrors) => ({ ...prevErrors, email: data.exists ? 'Cet email est déjà utilisé.' : '' }));
    }

    if (name === 'username' && value.trim() !== '') {
        const response = await fetch(`http://localhost:3000/check-username?username=${value}`);
        const data = await response.json();
        setErrors((prevErrors) => ({ ...prevErrors, username: data.exists ? 'Ce nom d’utilisateur est déjà pris.' : '' }));
    }
    };

    const handleSubmit = () => {
        if (!emailRegex.test(formData.email)) {
            alert('Veuillez entrer un email valide.');
            return;
        }
        if (errors.email) {
            alert(errors.email);
            return;
        }
        if (errors.username) {
            alert(errors.username);
            return;
        }
        if (formData.password !== formData.verifyPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
        if (!formData.email || !formData.password || !formData.username) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        onSubmit(formData); // Soumettre le formulaire
    };

    return (
        <div className={styles.authContainer}>
            <h2>Créer un compte</h2>
            
            <div className={styles.divider}></div>

            <label>Email :</label>
            <input className={styles.authInput} type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Username :</label>
            <input className={styles.authInput} type="text" name="username" value={formData.username} onChange={handleChange} required />

            <div className={styles.divider}></div>

            <label>Password :</label>
            <input className={styles.authInput} type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Verify Password :</label>
            <input className={styles.authInput} type="password" name="verifyPassword" value={formData.verifyPassword} onChange={handleChange} required />

            <label>Social Links :</label>
            <input className={styles.authInput} type="text" name="socialLinks" value={formData.socialLinks} onChange={handleChange} required />

            <button className={styles.authButton} onClick={handleSubmit}>Confirm</button>
        </div>
    );
}
