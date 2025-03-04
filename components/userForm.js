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
    };

    const handleSubmit = () => {
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email.');
            return;
        }
        if (errors.email) {
            alert("Email not recognized");
            return;
        }
        if (errors.username) {
            alert("Username not recognized");
            return;
        }
        if (formData.password !== formData.verifyPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (!formData.email || !formData.password || !formData.username) {
            alert('Please complete all fields.');
            return;
        }
        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: formData.username, email:formData.email, password: formData.password, role:"patron"})
        })
        .then(response =>response.json())
        .then(data => {
            console.log(data)
            // if data.result = true
            // const user = {username: data.username, token : data.token, role: data.role}
            // dispatch(addUserToStore(user)) 
            // mettre setIsLoggedIn(true) dans le onSubmit() ??? ou ailleurs, je sais pas, mais voir comment on remonte une info à son parent en gros
            onSubmit(); // Soumettre le formulaire 
        })
       
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
