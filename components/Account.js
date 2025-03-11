import styles from '../styles/layout.module.css';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, updateUserProfile } from '../reducers/user';
import ProjectCard from './ProjectCard';

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
            // Si c'est un champ webSite
            else if (name === "studio.webSite") {
                setEditingData(prevState => ({
                    ...prevState,
                    studio: { ...prevState.studio, webSite: value }
                }));
            }
            // Si c'est un champ description
            else if (name === "studio.description") {
                setEditingData(prevState => ({
                    ...prevState,
                    studio: { ...prevState.studio, description: value }
                }));
            }
            // Si c'est un champ de contact person
            else if (name.startsWith("studio.contactPerson.")) {
            const field = name.split(".")[2];
            setEditingData(prevState => ({
                ...prevState,
                studio: {
                    ...prevState.studio,
                    contactPerson: {
                        ...prevState.studio.contactPerson,
                        [field]: value
                    }
                }
            }));
        }
        // Si c'est un champ de contact manager
        else if (name.startsWith("studio.contactManager.")) {
            const field = name.split(".")[2];
            setEditingData(prevState => ({
                ...prevState,
                studio: {
                    ...prevState.studio,
                    contactManager: {
                        ...prevState.studio.contactManager,
                        [field]: value
                    }
                }
            }));
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
        console.log('voici ma data avant transformation: ', editingData)
        const dataToSave = {  // Créer un nouvel objet avec exactement le format attendu par l'API
            token: user.token,
            email: editingData.email,
            phone: editingData.phone,
            name: editingData.name,
            surname: editingData.surname,
            description: editingData.description,
            address: editingData.address, // Conserver comme objet, pas comme tableau
            socialLinks: editingData.socialLinks,
            studio: user.role === "studio" ? {
                ...user.studio,  // Garder les valeurs existantes
                webSite: editingData.studio.webSite,
                description: editingData.studio.description,
                contactPerson: editingData.studio.contactPerson,
                contactManager: editingData.studio.contactManager
            } : undefined
        };

        console.log('données à envoyer à l\'API : ', dataToSave);

        fetch(`http://localhost:3000/account/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                // Récupérer le texte complet de l'erreur
                return response.text().then(text => {
                    console.error('Erreur détaillée de l\'API:', text);
                    throw new Error(`Erreur ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Réponse réussie de l\'API:', data);
            
            // Mettre à jour le state local et Redux avec les nouvelles données
            setFormData(editingData);
            dispatch(updateUser({...editingData, token: user.token}));
            setIsEditing(false);
        })
        .catch(error => {
            console.error("Erreur lors de la sauvegarde:", error);
            // Tu pourrais ajouter une notification d'erreur ici
        });
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
            <h1>My Account</h1> {/* Titre de la page */}
            <br />
            <div>  {/* Affichage du nom d'utilisateur et du rôle, avec valeur par défaut si non spécifiée pour les 2 roles */}
                <p>Username : {user.username || 'Not specified'}</p>
                <p>Role : {user.role || 'Not specified'}</p>
            </div>
            <br />

            {/* Section de modification de mot de passe pour les 2 roles */}
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

            <br></br>
            <br></br>

            {/* Champs pour modifier les informations de l'utilisateur pour les 2 roles */}
            {isEditing ? (
                <>
            {/* Champs modifiables pour patron */}    
            {user.role !== "studio" && (
                <>
                    <p>Email : <input type="email" name="email" value={displayData.email} onChange={handleChange} /></p>
                    <p>Phone : <input type="text" name="phone" value={displayData.phone} onChange={handleChange} /></p>
                    <p>Name : <input type="text" name="name" value={displayData.name} onChange={handleChange} /></p>
                    <p>Surname : <input type="text" name="surname" value={displayData.surname} onChange={handleChange} /></p>
                    <p>Description : <textarea name="description" value={displayData.description} onChange={handleChange} /></p>

                    <br></br>
                    <h4>Address :</h4>
                    <p>Street Number : <input type="text" name="streetNumber" value={displayData.address.streetNumber} onChange={handleChange} /></p>
                    <p>Street : <input type="text" name="street" value={displayData.address.street} onChange={handleChange} /></p>
                    <p>Postal Code : <input type="text" name="postalCode" value={displayData.address.postalCode} onChange={handleChange} /></p>
                    <p>City : <input type="text" name="city" value={displayData.address.city} onChange={handleChange} /></p>
                    <p>Country : <input type="text" name="country" value={displayData.address.country} onChange={handleChange} /></p>
                </>
            )}

            {/* L'email est modifiable pour les 2 rôles */}
            {user.role === "studio" && (
                <>
                    <p>Email : <input type="email" name="email" value={displayData.email} onChange={handleChange} /></p>
                </>
            )}

                    <br /><br />
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
                            <br /><br />
                            <h3>Studio Information</h3>
                            <p>Company Name : {formData.studio.companyName}</p>
                            <p>Address : {`${formData.studio.address.street}, ${formData.studio.address.postalCode} ${formData.studio.address.city}, ${formData.studio.address.country}`}</p>
                            <p>SIRET : {formData.studio.siret}</p>
                            <p>SIREN : {formData.studio.siren}</p>
                            <p>Website : <input type="text" name="studio.webSite" value={displayData.studio.webSite} onChange={handleChange} /></p>
                            <p>Description : <textarea name="studio.description" value={displayData.studio.description} onChange={handleChange} /></p>
                            
                            <br /><br />
                            <h4>Contact Person :</h4>
                            <p>Name : <input type="text" name="studio.contactPerson.name" value={displayData.studio.contactPerson.name} onChange={handleChange} /></p>
                            <p>Surname : <input type="text" name="studio.contactPerson.surname" value={displayData.studio.contactPerson.surname} onChange={handleChange} /></p>
                            <p>Email : <input type="email" name="studio.contactPerson.email" value={displayData.studio.contactPerson.email} onChange={handleChange} /></p>
                            <p>Phone : <input type="text" name="studio.contactPerson.phone" value={displayData.studio.contactPerson.phone} onChange={handleChange} /></p>

                            <br /><br />
                            <h4>Contact Manager :</h4>
                            <p>Name : <input type="text" name="studio.contactManager.name" value={displayData.studio.contactManager.name} onChange={handleChange} /></p>
                            <p>Surname : <input type="text" name="studio.contactManager.surname" value={displayData.studio.contactManager.surname} onChange={handleChange} /></p>
                            <p>Email : <input type="email" name="studio.contactManager.email" value={displayData.studio.contactManager.email} onChange={handleChange} /></p>
                            <p>Phone : <input type="text" name="studio.contactManager.phone" value={displayData.studio.contactManager.phone} onChange={handleChange} /></p>
                        </>
                    )}
                </>
            ) : (
                <> {/* Affichage des informations lorsque l'édition n'est pas activée */}
                   {/* Pour les 2 roles */}
                   <br /><br />
                    <p>Email : {formData.email}</p>

                    {/* Juste pour le patron */}
                    {user.role === "patron" && (
                        <>
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
                        </>
                    )} 
                    
                    {/* Section spécifique aux studios */}
                    {user.role === "studio" && (
                        <>
                            <br /><br />
                            <h3>Studio Informations : </h3>
                            <p>Company Name : {formData.studio.companyName}</p>
                            <p>Address : {`${formData.studio.address.street}, ${formData.studio.address.postalCode} ${formData.studio.address.city}, ${formData.studio.address.country}`}</p> 
                            <p>SIRET : {formData.studio.siret}</p>
                            <p>SIREN : {formData.studio.siren}</p>
                            <p>Website : {formData.studio.webSite}</p>
                            <p>Description : {formData.studio.description}</p>
                            
                            <br /><br />
                            <h4>Contact Person :</h4>
                            <div>
                                <p>Name : {displayData.studio.contactPerson.name}</p>
                                <p>Surname : {displayData.studio.contactPerson.surname}</p>
                                <p>Email : {displayData.studio.contactPerson.email}</p>
                                <p>Phone : {displayData.studio.contactPerson.phone}</p>
                            </div>

                            <br /><br />
                            <h4>Contact Manager :</h4>
                            <div>
                                <p>Name : {displayData.studio.contactManager.name}</p>
                                <p>Surname : {displayData.studio.contactManager.surname}</p>
                                <p>Email : {displayData.studio.contactManager.email}</p>
                                <p>Phone : {displayData.studio.contactManager.phone}</p>
                            </div>

                            {/* Pour les 2 roles */}
                            <br /><br />
                            <h4>Social Links :</h4>
                            <p>Facebook : {formData.socialLinks[0] ? formData.socialLinks[0].url : ''}</p>
                            <p>Twitter : {formData.socialLinks[1] ? formData.socialLinks[1].url : ''}</p>
                            <p>Instagram : {formData.socialLinks[2] ? formData.socialLinks[2].url : ''}</p>
                            <p>LinkedIn : {formData.socialLinks[3] ? formData.socialLinks[3].url : ''}</p>
                            <p>YouTube : {formData.socialLinks[4] ? formData.socialLinks[4].url : ''}</p>
                            <p>GitHub : {formData.socialLinks[5] ? formData.socialLinks[5].url : ''}</p>
                        </>
                    )}
                </>
            )}


            <br></br>
            {/* Boutons pour activer l'édition ou enregistrer et annuler les modifications */}
            {!isEditing ? (
                <button onClick={startEditing}>Modify my informations</button>
            ) : (
                <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </>
            )}

            <br/><br/>
            <h4>Favorite Projects :</h4>
            {user.followedProjects?.length > 0 ? (
                user.followedProjects.map((proj, i) => <ProjectCard key={i} project={proj} />)
            ) : (
                <p>You don't have any favorite project yet</p>
            )}

            <br/><br/>

            {/* Section spécifique aux patrons */}
            {user.role === "patron" && (
                <>
                   <h4>Funded Projects :</h4>
                    {user.fundedProjects.length > 0 ? (
                              user.fundedProjects.map((proj, i) => <ProjectCard key={i} project={proj.project} />)
                            ) : (
                              <p>You did not fund any project yet</p>
                            )}

            <br/><br/>
        
                   <h4>Created Projects :</h4>
                    {user.createdProjects && user.createdProjects.length > 0 ? (
                              user.createdProjects.map((proj, i) => <ProjectCard key={i} project={proj} />)
                            ) : (
                            <p>You have not created any project yet</p>
                            )}
                </>
)}


            {/* Section spécifique aux studios */}
            {user.role === "studio" && (
                <>
                    <h4>Chosen Projects :</h4>
                    {user.studio?.chosenProjects?.length > 0 ? (
                        <ul>
                            {user.studio.chosenProjects.map((proj, i) => (
                                <li key={i}>{proj.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No chosen projects yet</p>
                    )}

                    <br/><br/>
                    <h4>Developed Projects :</h4>
                    {user.studio?.developedProjects?.length > 0 ? (
                        <ul>
                            {user.studio.developedProjects.map((proj, i) => (
                                <li key={i}>{proj.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No developed projects yet</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Account;