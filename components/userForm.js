import styles from '../styles/auth.module.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore } from '../reducers/user';

export default function SignupForm({ onSubmit, companyInfo }) {
    const dispatch = useDispatch();
    const role = useSelector((state) => state.user.value.role); // Récupère le rôle depuis Redux

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email' && !emailRegex.test(value)) {
            setErrors({ ...errors, email: 'Invalid email format.' });
        } else {
            setErrors({ ...errors, email: '' });
        }

        if (name === 'username' && value.length < 3) {
            setErrors({ ...errors, username: 'Username must be at least 3 characters long.' });
        } else {
            setErrors({ ...errors, username: '' });
        }
    };

    const handleSubmit = () => {
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email.');
            return;
        }

        if (formData.password !== formData.verifyPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!formData.email || !formData.password || !formData.username || !role) {
            alert('Please complete all fields.');
            return;
        }
       
        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: role,
            companyInfo: role === "studio" ? companyInfo : null,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data.token) {
                dispatch(addUserToStore(data)); // Ajoute l'utilisateur au store Redux
                if (onSubmit) onSubmit();
                alert('Registration successful!');
            } else if (data.message === "Email already registered") {
                alert("This email is already linked to an existing account.");
            } else {
                alert(data.message || "An error occurred. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
    };

    return (
        <div className={styles.authContainer}>
            <h2>Créer un compte</h2>
            
            <div className={styles.divider}></div>

            <label>Email :</label>
            <input className={styles.authInput} type="email" name="email" value={formData.email} onChange={handleChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} required/>

            <label>Username :</label>
            <input className={styles.authInput} type="text" name="username" value={formData.username} onChange={handleChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} required/>

            <div className={styles.divider}></div>

            <label>Password :</label>
            <input className={styles.authInput} type="password" name="password" value={formData.password} onChange={handleChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} required />

            <label>Verify Password :</label>
            <input className={styles.authInput} type="password" name="verifyPassword" value={formData.verifyPassword} onChange={handleChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} required />

            <button className={styles.authButton} onClick={handleSubmit}>Confirm</button>
        </div>
    );
}
