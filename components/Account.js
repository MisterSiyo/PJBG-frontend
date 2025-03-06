import styles from '../styles/layout.module.css';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../reducers/user';

const Account = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.user.value);
    const isAuthenticated = !!user.token;

    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState(null); // État pour gérer l'édition
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
        description: '',
        address: {
            number: '',
            street: '',
            zipCode: '',
            city: '',
            country: '',
        },
        socialLinks: {
            Facebook: '',
            Twitter: '',
            Instagram: '',
            LinkedIn: '',
            YouTube: '',
            GitHub: '',
        }
    });

    // Initialisation des champs à partir des données de l'utilisateur
    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                name: user.name || '',
                surname: user.surname || '',
                description: user.description || '',
                address: {
                    number: user.address?.number || '',
                    street: user.address?.street || '',
                    zipCode: user.address?.zipCode || '',
                    city: user.address?.city || '',
                    country: user.address?.country || '',
                },
                socialLinks: {
                    Facebook: user.socialLinks?.Facebook || '',
                    Twitter: user.socialLinks?.Twitter || '',
                    Instagram: user.socialLinks?.Instagram || '',
                    LinkedIn: user.socialLinks?.LinkedIn || '',
                    YouTube: user.socialLinks?.YouTube || '',
                    GitHub: user.socialLinks?.GitHub || '',
                }
            });
        }
    }, [user]);

    // Fonction pour gérer la modification des champs
    const handleEdit = (field) => {
        setEditingField(field);

        // Initialisation des champs en fonction de l'élément à modifier
        if (field === 'address') {
            setFormData(prevData => ({
                ...prevData,
                address: {
                    number: user.address?.number || '',
                    street: user.address?.street || '',
                    zipCode: user.address?.zipCode || '',
                    city: user.address?.city || '',
                    country: user.address?.country || '',
                }
            }));
        } else if (field === 'socialLinks') {
            setFormData(prevData => ({
                ...prevData,
                socialLinks: {
                    Facebook: user.socialLinks?.Facebook || '',
                    Twitter: user.socialLinks?.Twitter || '',
                    Instagram: user.socialLinks?.Instagram || '',
                    LinkedIn: user.socialLinks?.LinkedIn || '',
                    YouTube: user.socialLinks?.YouTube || '',
                    GitHub: user.socialLinks?.GitHub || '',
                }
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [field]: user[field] || ''
            }));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (field) => {
        let dataToSave = { [field]: formData[field] };

        // Pour 'address' et 'socialLinks', on envoie des objets complets
        if (field === 'address') {
            dataToSave = { address: formData.address };
        } else if (field === 'socialLinks') {
            dataToSave = { socialLinks: formData.socialLinks };
        }

        fetch(`http://localhost:3001/account`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dataToSave),
        })
        .then(response => response.json())
        .then(updatedUser => {
            dispatch(updateUserProfile(updatedUser));
            setEditingField(null);
        })
        .catch(error => console.error('Erreur de mise à jour:', error));
    };

    return (
        <div className={styles.accountPage}>
            <h1>My Account</h1>
            <br></br>           
            <div>
                <p>Username : {user.username || 'Not specified'}</p>
            </div>
            {['email', 'name', 'surname', 'description'].map(field => (
                <div key={field}>
                    <p>
                        {field.charAt(0).toUpperCase() + field.slice(1)} :&nbsp;
                        {editingField === field ? (
                            <>
                                <input type="text" name={field} value={formData[field]} onChange={handleChange} />
                                <button onClick={() => handleSave(field)}>Save</button>
                                <button onClick={() => setEditingField(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {formData[field] || 'Not specified'}
                                &nbsp; <button onClick={() => handleEdit(field)}>Modify</button>
                            </>
                        )}
                    </p>
                </div>
            ))}
            <br></br>           
            <h4>Address :</h4>
                <div>
                    {['Number', 'Street', 'Zip Code', 'City', 'Country'].map(field => (
                        <div key={field}>
                            <label>{field}: </label>
                            <input type="text" name={field.toLowerCase()} value={formData.address[field.toLowerCase()] || ''} onChange={handleChange} placeholder={field}/>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleSave('address')}>Save</button>

            <br></br>
            <br></br>
            <h4>Social Links :</h4>
            <div>
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'GitHub'].map(link => (
                    <div key={link}>
                        <label>{link}: </label>
                        <input type="text" name={link} value={formData.socialLinks[link] || ''} onChange={handleChange} placeholder={link}/>
                    </div>
                ))}
            </div>
            <button onClick={() => handleSave('socialLinks')}>Save</button>

            <h2>Funded projects :</h2>
            <ul>
                {user.fundedProjects && user.fundedProjects.map((project, index) => (
                    <li key={index}>
                        {project.name} - {project.amount}€ le {new Date(project.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>

            <h2>Projects created :</h2>
            <ul>
                {user.createdProjects && user.createdProjects.map((project, index) => (
                    <li key={index}>
                        {project.name} - Créé le {new Date(project.creationDate).toLocaleDateString()}
                    </li>
                ))}
            </ul>

            <h2>Favorite projects :</h2>
            <ul>
                {user.favoriteProjects && user.favoriteProjects.map((project, index) => (
                    <li key={index}>{project.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Account;
