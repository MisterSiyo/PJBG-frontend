import styles from '../styles/auth.module.css';
import { useState } from 'react';

export default function SignIn({ onSubmit }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.email || !formData.password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        onSubmit(formData);
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
