import styles from '../styles/layout.module.css';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, updateUserProfile } from '../reducers/user';

const Account = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.user.value);
    const isAuthenticated = !!user.token;

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
        phone: '',
        description: '',
        address: {
            streetNumber: '',
            street: '',
            postalCode: '',
            city: '',
            country: '',
        },
        socialLinks: [
            { platform: 'Facebook', url: '' },
            { platform: 'Twitter', url: '' },
            { platform: 'Instagram', url: '' },
            { platform: 'LinkedIn', url: '' },
            { platform: 'YouTube', url: '' },
            { platform: 'GitHub', url: '' }
        ],
        studio: {
            siret: '',
            siren: '',
            companyName: '',
            webSite: '',
            description: '',
            brand: '',
            subBrand: '',
            contactPerson: 
                {
                    name: '',
                    surname: '',
                    email: '',
                    phone: '',
                }
            ,
            contactManager: 
                {
                    name: '',
                    surname: '',
                    email: '',
                    phone: '',
                }
            ,
            address: {
                streetNumber: '',
                street: '',
                postalCode: '',
                city: '',
                country: '',
            },
        },
        gamingPreferences: []
    });
    
    // Variable pour stocker temporairement les données en cours d'édition
    const [editingData, setEditingData] = useState(null);

    useEffect(() => {
        if (user) {
            // Données communes à tous les utilisateurs
            const userData = {
                email: user.email || '',
                name: user.name || '',
                surname: user.surname || '',
                phone: user.phone || '',
                description: user.description || '',
                address: {
                    streetNumber: user.address?.streetNumber || '',
                    street: user.address?.street || '',
                    postalCode: user.address?.postalCode || '',
                    city: user.address?.city || '',
                    country: user.address?.country || '',
                }
                ,
                socialLinks: [
                    { platform: 'Facebook', url: user.socialLinks?.[0]?.url || '' },
                    { platform: 'Twitter', url: user.socialLinks?.[1]?.url || '' },
                    { platform: 'Instagram', url: user.socialLinks?.[2]?.url || '' },
                    { platform: 'LinkedIn', url: user.socialLinks?.[3]?.url || '' },
                    { platform: 'YouTube', url: user.socialLinks?.[4]?.url || '' },
                    { platform: 'GitHub', url: user.socialLinks?.[5]?.url || '' }
                ],
                gamingPreferences: user.gamingPreferences || [],
                studio: {
                    siret: user.studio?.siret || '',
                    siren: user.studio?.siren || '',
                    companyName: user.studio?.companyName || '',
                    webSite: user.studio?.webSite || '',
                    description: user.studio?.description || '',
                    brand: user.studio?.brand || '',
                    subBrand: user.studio?.subBrand || '',
                    contactPerson: user.studio?.contactPerson || {
                            name: '',
                            surname: '',
                            email: '',
                            phone: '',
                        },
                    contactManager: user.studio?.contactManager || {
                            name: '',
                            surname: '',
                            email: '',
                            phone: '',
                        },
                    address: user.studio?.address || {
                        streetNumber: '',
                        street: '',
                        postalCode: '',
                        city: '',
                        country: '',
                    },
                }
            };
            
            setFormData(userData);
        }
    }, [user]);

    // Fonction pour activer le mode d'édition
    const startEditing = () => {
        // Faire une copie profonde de formData pour l'édition
        setEditingData(JSON.parse(JSON.stringify(formData)));
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Gérer les différents types de champs
        if (name in editingData.address) {
            setEditingData(prevState => ({
                ...prevState,
                address: { ...prevState.address, [name]: value },
            }));
        } 
        // Si c'est un champ de lien social
        else if (name.startsWith("socialLinks")) {
            const index = parseInt(name.split('[')[1].split(']')[0]);
            setEditingData(prevState => {
                const updatedSocialLinks = [...prevState.socialLinks];
                updatedSocialLinks[index].url = value;
                return { ...prevState, socialLinks: updatedSocialLinks };
            });
        }
        // Si c'est un champ studio
        else if (name.startsWith("studio.")) {
            const studioField = name.replace("studio.", "");
            setEditingData(prevState => ({
                ...prevState,
                studio: { ...prevState.studio, [studioField]: value }
            }));
        }
        // Si c'est un champ d'adresse de studio
        else if (name.startsWith("studio.address.")) {
            const addressField = name.replace("studio.address.", "");
            setEditingData(prevState => ({
                ...prevState,
                studio: { 
                    ...prevState.studio, 
                    address: { ...prevState.studio.address, [addressField]: value }
                }
            }));
        }
        // Si c'est un champ de contact person
        else if (name.startsWith("studio.contactPerson")) {
            const matches = name.match(/studio\.contactPerson\[(\d+)\]\.(.+)/);
            if (matches) {
                const [, index, field] = matches;
                setEditingData(prevState => {
                    const updatedContactPersons = [...prevState.studio.contactPerson];
                    updatedContactPersons[index] = {
                        ...updatedContactPersons[index],
                        [field]: value
                    };
                    return {
                        ...prevState,
                        studio: {
                            ...prevState.studio,
                            contactPerson: updatedContactPersons
                        }
                    };
                });
            }
        }
        // Si c'est un champ de contact manager
        else if (name.startsWith("studio.contactManager")) {
            const matches = name.match(/studio\.contactManager\[(\d+)\]\.(.+)/);
            if (matches) {
                const [, index, field] = matches;
                setEditingData(prevState => {
                    const updatedContactManagers = [...prevState.studio.contactManager];
                    updatedContactManagers[index] = {
                        ...updatedContactManagers[index],
                        [field]: value
                    };
                    return {
                        ...prevState,
                        studio: {
                            ...prevState.studio,
                            contactManager: updatedContactManagers
                        }
                    };
                });
            }
        }
        else {
            setEditingData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevState => ({ ...prevState, [name]: value }));
        
        // Réinitialiser l'erreur lorsque l'utilisateur tape
        if (passwordError) {
            setPasswordError('');
        }
    };

    const handleSave = () => {
        // Préparation des données pour le format attendu par l'API
        console.log('voici ma data : ', editingData)
        const dataToSave = { 
            ...editingData, 
            token: user.token,
            // Transformer l'objet address en tableau pour correspondre au format de l'API
            // address: [editingData.address]
        };

        fetch(`http://localhost:3000/account/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
        .then(response => response.json())
        .then(data => {
            if (!data) return;
            
            // Après la sauvegarde, mettre à jour le state global (Redux)
            dispatch(updateUser(dataToSave));
            
            // Mettre à jour formData avec les nouvelles valeurs après la sauvegarde
            setFormData(editingData);
        })
        .catch(error => {
            console.error("Error saving user data:", error);
        });
        
        setIsEditing(false);
    };
    
    // Fonction pour annuler les modifications
    const handleCancel = () => {
        setIsEditing(false);
        setEditingData(null);
    };

    // Fonction pour ouvrir le formulaire de changement de mot de passe
    const startPasswordChange = () => {
        setIsChangingPassword(true);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordError('');
    };

    // Fonction pour sauvegarder le nouveau mot de passe
    const saveNewPassword = () => {
        // Vérifier que le nouveau mot de passe et la confirmation correspondent
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Les mots de passe ne correspondent pas');
            return;
        }

        // Vérifier que le nouveau mot de passe a au moins 6 caractères
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        // Préparer les données pour l'API
        const passwordUpdateData = {
            token: user.token,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        };

        fetch(`http://localhost:3000/account/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passwordUpdateData),
        })
        //.then(response => response.json())
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json().then(data => ({ ok: true, data }));
            } else {
        // Récupérer le texte de la réponse pour déboguer
        return response.text().then(text => {
            console.log("Réponse non-JSON du serveur:", text);
            return { ok: false, error: "Réponse non-JSON du serveur" };
            });
            }       
        })
        /*.then(data => {
            if (data.error) {
                setPasswordError(data.error);
                return;
            }*/
                .then(result => {
                    if (!result.ok) {
                        setPasswordError(result.error);
                        return;
                    }
                    
                    const data = result.data;
                    if (data && data.error) {
                        setPasswordError(data.error);
                        return;
                    }  
            
            // Fermer le formulaire de changement de mot de passe
            setIsChangingPassword(false);
            // Réinitialiser les champs de mot de passe
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        })
        .catch(error => {
            console.error("Error updating password:", error);
            setPasswordError('Une erreur est survenue lors de la mise à jour du mot de passe');
        });
    };

    // Fonction pour annuler le changement de mot de passe
    const cancelPasswordChange = () => {
        setIsChangingPassword(false);
        setPasswordError('');
    };

    // Déterminer quelles données afficher pendant l'édition
    const displayData = isEditing ? editingData : formData;

    return (
        <div className={styles.accountPage}>
            <h1>My Account</h1>
            <br />
            <div>
                <p>Username : {user.username || 'Not specified'}</p>
                <p>Role : {user.role || 'Not specified'}</p>
            </div>
            <br />

            {/* Section de modification de mot de passe */}
            {isChangingPassword ? (
                <div className={styles.passwordSection}>
                    <h3>Change Password</h3>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                    <p>Current Password : <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} /></p>
                    <p>New Password : <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></p>
                    <p>Confirm New Password : <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} /></p>
                    <button onClick={saveNewPassword}>Save New Password</button>
                    <button onClick={cancelPasswordChange}>Cancel</button>
                </div>
            ) : (
                <button onClick={startPasswordChange}>Change Password</button>
            )}

            <br /><br />

            {/* Section d'informations générales */}
            {isEditing ? (
                <>
                    <p>Email : <input type="email" name="email" value={displayData.email} onChange={handleChange} /></p>
                    <p>Phone : <input type="text" name="phone" value={displayData.phone} onChange={handleChange} /></p>
                    <p>Name : <input type="text" name="name" value={displayData.name} onChange={handleChange} /></p>
                    <p>Surname : <input type="text" name="surname" value={displayData.surname} onChange={handleChange} /></p>
                    <p>Description : <textarea name="description" value={displayData.description} onChange={handleChange} /></p>

                    <h4>Address :</h4>
                    <p>Street Number : <input type="text" name="streetNumber" value={displayData.address.streetNumber} onChange={handleChange} /></p>
                    <p>Street : <input type="text" name="street" value={displayData.address.street} onChange={handleChange} /></p>
                    <p>Postal Code : <input type="text" name="postalCode" value={displayData.address.postalCode} onChange={handleChange} /></p>
                    <p>City : <input type="text" name="city" value={displayData.address.city} onChange={handleChange} /></p>
                    <p>Country : <input type="text" name="country" value={displayData.address.country} onChange={handleChange} /></p>

                    <h4>Social Links :</h4>
                    <p>Facebook : 
                        <input type="text" name="socialLinks[0]" value={displayData.socialLinks[0] ? displayData.socialLinks[0].url : ''} onChange={handleChange}/>
                    </p>
                    <p>Twitter : 
                        <input type="text" name="socialLinks[1]" value={displayData.socialLinks[1] ? displayData.socialLinks[1].url : ''} onChange={handleChange}/>
                    </p>
                    <p>Instagram : 
                        <input type="text" name="socialLinks[2]" value={displayData.socialLinks[2] ? displayData.socialLinks[2].url : ''} onChange={handleChange}/>
                    </p>
                    <p>LinkedIn : 
                        <input type="text" name="socialLinks[3]" value={displayData.socialLinks[3] ? displayData.socialLinks[3].url : ''} onChange={handleChange}/>
                    </p>
                    <p>YouTube : 
                        <input type="text" name="socialLinks[4]" value={displayData.socialLinks[4] ? displayData.socialLinks[4].url : ''} onChange={handleChange}/>
                    </p>
                    <p>GitHub : 
                        <input type="text" name="socialLinks[5]" value={displayData.socialLinks[5] ? displayData.socialLinks[5].url : ''} onChange={handleChange}/>
                    </p>

                    {/* Section spécifique aux studios */}
                    {user.role === "studio" && (
                        <>
                            <h3>Studio Information</h3>
                            <p>SIRET : <input type="text" name="studio.siret" value={displayData.studio.siret} onChange={handleChange} /></p>
                            <p>SIREN : <input type="text" name="studio.siren" value={displayData.studio.siren} onChange={handleChange} /></p>
                            <p>Company Name : <input type="text" name="studio.companyName" value={displayData.studio.companyName} onChange={handleChange} /></p>
                            <p>TVA Number : <input type="text" name="studio.numtva" value={displayData.studio.numtva} onChange={handleChange} /></p>
                            <p>NAF Code : <input type="text" name="studio.naf" value={displayData.studio.naf} onChange={handleChange} /></p>
                            <p>RCS : <input type="text" name="studio.rcs" value={displayData.studio.rcs} onChange={handleChange} /></p>
                            <p>Greffe : <input type="text" name="studio.greffe" value={displayData.studio.greffe} onChange={handleChange} /></p>
                            <p>Capital : <input type="text" name="studio.capital" value={displayData.studio.capital} onChange={handleChange} /></p>
                            <p>Legal Status : <input type="text" name="studio.status" value={displayData.studio.status} onChange={handleChange} /></p>
                            <p>Website : <input type="text" name="studio.webSite" value={displayData.studio.webSite} onChange={handleChange} /></p>
                            <p>Description : <textarea name="studio.description" value={displayData.studio.description} onChange={handleChange} /></p>
                            <p>Brand : <input type="text" name="studio.brand" value={displayData.studio.brand} onChange={handleChange} /></p>
                            <p>Sub-brand : <input type="text" name="studio.subBrand" value={displayData.studio.subBrand} onChange={handleChange} /></p>
                            
                            <h4>Studio Address :</h4>
                            <p>Street Number : <input type="text" name="studio.address.streetNumber" value={displayData.studio.address.streetNumber} onChange={handleChange} /></p>
                            <p>Street : <input type="text" name="studio.address.street" value={displayData.studio.address.street} onChange={handleChange} /></p>
                            <p>Postal Code : <input type="text" name="studio.address.postalCode" value={displayData.studio.address.postalCode} onChange={handleChange} /></p>
                            <p>City : <input type="text" name="studio.address.city" value={displayData.studio.address.city} onChange={handleChange} /></p>
                            <p>Country : <input type="text" name="studio.address.country" value={displayData.studio.address.country} onChange={handleChange} /></p>
                            
                            <h4>Contact Person :</h4>
                            {displayData.studio.contactPerson.map((contact, index) => (
                                <div key={`contact-person-${index}`}>
                                    <p>Name : <input type="text" name={`studio.contactPerson[${index}].name`} value={contact.name} onChange={handleChange} /></p>
                                    <p>Surname : <input type="text" name={`studio.contactPerson[${index}].surname`} value={contact.surname} onChange={handleChange} /></p>
                                    <p>Email : <input type="email" name={`studio.contactPerson[${index}].email`} value={contact.email} onChange={handleChange} /></p>
                                    <p>Phone : <input type="text" name={`studio.contactPerson[${index}].phone`} value={contact.phone} onChange={handleChange} /></p>
                                </div>
                            ))}
                            
                            <h4>Contact Manager :</h4>
                            {displayData.studio.contactManager.map((manager, index) => (
                                <div key={`contact-manager-${index}`}>
                                    <p>Name : <input type="text" name={`studio.contactManager[${index}].name`} value={manager.name} onChange={handleChange} /></p>
                                    <p>Surname : <input type="text" name={`studio.contactManager[${index}].surname`} value={manager.surname} onChange={handleChange} /></p>
                                    <p>Email : <input type="email" name={`studio.contactManager[${index}].email`} value={manager.email} onChange={handleChange} /></p>
                                    <p>Phone : <input type="text" name={`studio.contactManager[${index}].phone`} value={manager.phone} onChange={handleChange} /></p>
                                </div>
                            ))}
                        </>
                    )}
                </>
            ) : (
                <>
                    <p>Email : {formData.email}</p>
                    <p>Phone : {formData.phone}</p>
                    <p>Name : {formData.name}</p>
                    <p>Surname : {formData.surname}</p>
                    <p>Description : {formData.description}</p>

                    <br /><br />
                    <h4>Address :</h4>
                    <p>Street Number : {formData.address.streetNumber}</p>
                    <p>Street : {formData.address.street}</p>
                    <p>Postal Code : {formData.address.postalCode}</p>
                    <p>City : {formData.address.city}</p>
                    <p>Country : {formData.address.country}</p>
                    
                    <br /><br />
                    <h4>Social Links :</h4>
                    <p>Facebook : {formData.socialLinks[0] ? formData.socialLinks[0].url : ''}</p>
                    <p>Twitter : {formData.socialLinks[1] ? formData.socialLinks[1].url : ''}</p>
                    <p>Instagram : {formData.socialLinks[2] ? formData.socialLinks[2].url : ''}</p>
                    <p>LinkedIn : {formData.socialLinks[3] ? formData.socialLinks[3].url : ''}</p>
                    <p>YouTube : {formData.socialLinks[4] ? formData.socialLinks[4].url : ''}</p>
                    <p>GitHub : {formData.socialLinks[5] ? formData.socialLinks[5].url : ''}</p>

                    {/* Section spécifique aux studios */}
                    {user.role === "studio" && (
                        <>
                            <br /><br />
                            <h3>Studio Information</h3>
                            <p>SIRET : {formData.studio.siret}</p>
                            <p>SIREN : {formData.studio.siren}</p>
                            <p>Company Name : {formData.studio.companyName}</p>
                            <p>TVA Number : {formData.studio.numtva}</p>
                            <p>NAF Code : {formData.studio.naf}</p>
                            <p>RCS : {formData.studio.rcs}</p>
                            <p>Greffe : {formData.studio.greffe}</p>
                            <p>Capital : {formData.studio.capital}</p>
                            <p>Legal Status : {formData.studio.status}</p>
                            <p>Website : {formData.studio.webSite}</p>
                            <p>Description : {formData.studio.description}</p>
                            <p>Brand : {formData.studio.brand}</p>
                            <p>Sub-brand : {formData.studio.subBrand}</p>
                            
                            <br /><br />
                            <h4>Studio Address :</h4>
                            <p>Street Number : {formData.studio.address.streetNumber}</p>
                            <p>Street : {formData.studio.address.street}</p>
                            <p>Postal Code : {formData.studio.address.postalCode}</p>
                            <p>City : {formData.studio.address.city}</p>
                            <p>Country : {formData.studio.address.country}</p>
                            
                            <br /><br />
                            <h4>Contact Person :</h4>
                            {formData.studio.contactPerson && formData.studio.contactPerson.map((contact, index) => (
                                <div key={`contact-person-${index}`}>
                                    <p>Name : {contact.name}</p>
                                    <p>Surname : {contact.surname}</p>
                                    <p>Email : {contact.email}</p>
                                    <p>Phone : {contact.phone}</p>
                                    <br />
                                </div>
                            ))}
                            
                            <h4>Contact Manager :</h4>
                            {formData.studio.contactManager && formData.studio.contactManager.map((manager, index) => (
                                <div key={`contact-manager-${index}`}>
                                    <p>Name : {manager.name}</p>
                                    <p>Surname : {manager.surname}</p>
                                    <p>Email : {manager.email}</p>
                                    <p>Phone : {manager.phone}</p>
                                    <br />
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}

            <br />
            {!isEditing ? (
                <button onClick={startEditing}>Modify my informations</button>
            ) : (
                <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </>
            )}

            <br /><br /><br />

            {/* Section spécifique aux patrons */}
            {user.role === "patron" && (
                <>
                   <h4>Funded Projects :</h4>
                    <ul>
                        {user.fundedProjects && user.fundedProjects.length > 0 && (
                            <>
                                {user.fundedProjects[0] && <li>{user.fundedProjects[0].name} - {user.fundedProjects[0].amount}€ on {new Date(user.fundedProjects[0].date).toLocaleDateString()}</li>}
                                {user.fundedProjects[1] && <li>{user.fundedProjects[1].name} - {user.fundedProjects[1].amount}€ on {new Date(user.fundedProjects[1].date).toLocaleDateString()}</li>}
                                {user.fundedProjects[2] && <li>{user.fundedProjects[2].name} - {user.fundedProjects[2].amount}€ on {new Date(user.fundedProjects[2].date).toLocaleDateString()}</li>}
                            </>
                        )}
                    </ul>

                    <h4>Created Projects :</h4>
                    <ul>
                        {user.createdProjects && user.createdProjects.length > 0 && (
                            <>
                                {user.createdProjects[0] && <li>{user.createdProjects[0].name} - Created on {new Date(user.createdProjects[0].creationDate).toLocaleDateString()}</li>}
                                {user.createdProjects[1] && <li>{user.createdProjects[1].name} - Created on {new Date(user.createdProjects[1].creationDate).toLocaleDateString()}</li>}
                                {user.createdProjects[2] && <li>{user.createdProjects[2].name} - Created on {new Date(user.createdProjects[2].creationDate).toLocaleDateString()}</li>}
                            </>
                        )}
                    </ul>
                </>
            )}

            {/* Section spécifique aux studios */}
            {user.role === "studio" && (
                <>
                    <h4>Chosen Projects :</h4>
                    <ul>
                        {user.studio?.chosenProjects && user.studio.chosenProjects.length > 0 && (
                            <>
                                {user.studio.chosenProjects[0] && <li>{user.studio.chosenProjects[0].name}</li>}
                                {user.studio.chosenProjects[1] && <li>{user.studio.chosenProjects[1].name}</li>}
                                {user.studio.chosenProjects[2] && <li>{user.studio.chosenProjects[2].name}</li>}
                            </>
                        )}
                    </ul>
                   
                    <h4>Developed Projects :</h4>
                    <ul>
                        {user.studio?.developedProjects && user.studio.developedProjects.length > 0 && (
                            <>
                                {user.studio.developedProjects[0] && <li>{user.studio.developedProjects[0].name}</li>}
                                {user.studio.developedProjects[1] && <li>{user.studio.developedProjects[1].name}</li>}
                                {user.studio.developedProjects[2] && <li>{user.studio.developedProjects[2].name}</li>}
                            </>
                        )}
                    </ul>
                </>
            )}

            <h4>Favorite Projects :</h4>
            <ul>
                {user.userFavorites?.favorites && user.userFavorites.favorites.length > 0 && (
                    <>
                        {user.userFavorites.favorites[0] && <li>{user.userFavorites.favorites[0].name}</li>}
                        {user.userFavorites.favorites[1] &&  <li>{user.userFavorites.favorites[1].name}</li>}
                        {user.userFavorites.favorites[2] &&  <li>{user.userFavorites.favorites[2].name}</li>}
                    </>
                )}
            </ul>
           
            <h4>My Game Genre Preferences :</h4>
        </div>
    );
};

export default Account;