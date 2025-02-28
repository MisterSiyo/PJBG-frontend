import styles from '../styles/auth.module.css';
import { useState } from 'react';

export default function SignIn({ onSubmit }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {

        // Vérification du format de l’email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.email)) {
            alert('Adresse email invalide.');
            return;
        }

// Vérification que tous les champs sont remplis
    if (!formData.email || !formData.password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const data = await response.json();
            if (data.message === 'Email non reconnu') {
                alert('Email inconnu. Veuillez vérifier votre adresse ou créer un compte.');
            } else if (data.message === 'Mot de passe incorrect') {
                alert('Mot de passe incorrect. Veuillez réessayer.');
            } else {
                alert('Une erreur est survenue. Veuillez réessayer plus tard.');
            }
            return;
        }
        const data = await response.json();
        onSubmit(data); // On soumet les infos si tout est bon
    } catch (error) {
        alert('Erreur serveur. Veuillez réessayer plus tard.');
    }
    };


    // modifiez les connect à  SignupWithOAuth pour raccorder Reddit logins et Google logins - a faire dans components
    return (
        <div className={styles.authContainer}>
            <button className={styles.authButton} onClick={() => alert('Authentification Reddit en cours...')}>Connect with Reddit</button> 
            <button className={styles.authButton} onClick={() => alert('Authentification Google en cours...')}>Connect with Google</button>

            <h3 className={styles.separator}>or</h3>

            <label>Email:</label>
            <input className={styles.authInput} type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password:</label>
            <input className={styles.authInput} type="password" name="password" value={formData.password} onChange={handleChange} required />

            <button className={styles.authButton} onClick={handleSubmit}>Valider</button>
        </div>
    );
}
