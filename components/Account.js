import styles from '../styles/layout.module.css';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { fetchUserProfile } from '../reducers/user'; // Action pour récupérer le profil utilisateur

// Page (composant) "Account" => logique et la structure de la page. Ce composant est importé et utilisé dans la page /account, ce qui veut dire qu'il est un "sous-composant" qui vient alimenter la page principale.

const Account = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.user.value);
    const isAuthenticated = !!user.token;

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false); // État pour gérer l'édition
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
        address: '',
        socialLinks: '',
        description: ''
    });

    /*useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            fetch('http://localhost:3001/account', {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de récupération des données utilisateur');
                }
                return response.json();
            })
            .then(data => {
                dispatch(fetchUserProfile(data));
                setFormData({
                    email: data.email,
                    name: data.name,
                    surname: data.surname,
                    address: data.address || '',
                    socialLinks: data.socialLinks?.join(', ') || '',
                    description: data.description || ''
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du profil utilisateur:', error);
            })
            .finally(() => setLoading(false));
        }
    }, [isAuthenticated, dispatch, router]);*/

    // Fonction pour gérer la mise à jour des données du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Fonction pour envoyer les modifications au backend
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/account', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du profil');
            }
            return response.json();
        })
        .then(updatedUser => {
            dispatch(fetchUserProfile(updatedUser));
            setEditing(false); // Désactive le mode édition après la mise à jour
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du profil:', error);
        });
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (!user || !user.email) {
    //     return <div>Aucun profil utilisateur trouvé.</div>;
    // }

    return (
        <div className={styles.accountPage}>
            <h1>My Acount</h1>

            {editing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email :</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Name :</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Surname :</label>
                        <input type="text" name="surname" value={formData.surname} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Address :</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Social networks :</label>
                        <input type="text" name="socialLinks" value={formData.socialLinks} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Presentation :</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div>
                        <button type="submit">Enregistrer les modifications</button>
                        <button type="button" onClick={() => setEditing(false)}>Annuler</button>
                    </div>
                </form>
            ) : (
                <div>
                    <p>Email : {user.email}</p>
                    <p>Name : {user.name}</p>
                    <p>Surname : {user.surname}</p>
                    <p>Address : {user.address || 'Non renseignée'}</p>
                    <p>Social networks  : {user.socialLinks ? user.socialLinks.join(', ') : 'Non renseignés'}</p>
                    <p>Presentation : {user.description || 'Non renseignée'}</p>

                    <h2>Projets financés</h2>
                    <ul>
                        {user.fundedProjects && user.fundedProjects.map((project, index) => (
                            <li key={index}>
                                {project.name} - {project.amount}€ le {new Date(project.date).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>

                    <h2>Projets créés</h2>
                    <ul>
                        {user.createdProjects && user.createdProjects.map((project, index) => (
                            <li key={index}>
                                {project.name} - Créé le {new Date(project.creationDate).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>

                    <h2>Projets favoris</h2>
                    <ul>
                        {user.favoriteProjects && user.favoriteProjects.map((project, index) => (
                            <li key={index}>{project.name}</li>
                        ))}
                    </ul>

                    <button onClick={() => setEditing(true)}>Modifier mon profil</button>
                </div>
            )}
        </div>
    );
};

export default Account;