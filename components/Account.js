import styles from '../styles/account.module.css';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, updateUserProfile } from '../reducers/user';
import ProjectCard from './ProjectCard';
import { addUserToStore } from '../reducers/user';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa';

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
    const [modifErrorMessage, setModifErrorMessage] = useState('');
    const [projectsDataList, setProjectsDataList] = useState([]);
    const [pcardFa, setPcardFa] = useState([]);
    const [pcardFu, setPcardFu] = useState([]);
    const [pcardCr, setPcardCr] = useState([]);
    const [pcardD, setPcardD] = useState([]);
    const [pcardCh, setPcardCh] = useState([]);

    
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

if (!user.token) {
    router.push('/')
}

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

        if (dataToSave.email.trim() === '') {
            setModifErrorMessage('veuillez renseigner une adresse mail')
            return;
        }

        fetch(`http://localhost:3000/account/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
        .then(response => {

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

            
            // Mettre à jour le state local et Redux avec les nouvelles données
            setFormData(editingData);
            dispatch(updateUser({...editingData, token: user.token}));
            setIsEditing(false);
            setModifErrorMessage('')
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
        <div>
            <h1 className={styles.titlePage}>My Account</h1> {/* Titre de la page */}
            <br />
          <div className={styles.conteneurSections}>
            <div className={styles.sectionGauche}>  {/* Affichage du nom d'utilisateur et du rôle, avec valeur par défaut si non spécifiée pour les 2 roles */}
            <div className="photoContainer">
                 <img src="/images/photoProfile.jpg"  alt="Photo de profil gamer futuriste" className={styles.photoProfile}  />
            </div>
            <div className={styles.userInfoGauche1}><p className={styles.titleSection}>Username :</p> <p>{user.username || 'Not specified'}</p></div>    
            <div className={styles.userInfoGauche2}><p className={styles.titleSection}>Role :</p> <p>{user.role || 'Not specified'}</p></div>
            <br />            

            {/* Section de modification de mot de passe pour les 2 roles */}
            {isChangingPassword ? (
                <div className={styles.passwordSection}>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                    <br></br>
                    <p className={styles.titleSection}> Current Password : <input className={styles.input} type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} /></p>
                    <p className={styles.titleSection}>New Password : <input className={styles.input} type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></p>
                    <p className={styles.titleSection}>Confirm New Password : <input className={styles.input} type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} /></p>
                    <br></br>
                    <button className={styles.buttonNewPass} onClick={saveNewPassword}>Save New Password</button>
                    <button className={styles.button}onClick={cancelPasswordChange}>Cancel</button>
                    </div>
            ) : (
                <button className={styles.button} onClick={startPasswordChange}>Change my Password</button>
            )}
            <br/><br/>
            </div>

            <br></br>
            <br></br>
            <p>{modifErrorMessage}</p>
            {/* Champs pour modifier les informations de l'utilisateur pour les 2 roles */}
            {isEditing ? (
                
            <div className={styles.sectionDroite}>
            {/* Champs modifiables pour patron */}    
            {user.role !== "studio" && (
                <div>
                    <br></br>
                    <h4 className={styles.titleSectionDroite}>Contact : </h4>
                    <p className={styles.subtitleSectionDroite}>Email : <input className={styles.input} type="email" name="email" value={displayData.email} onChange={handleChange} /></p>
                    <p className={styles.subtitleSectionDroite}>Phone : <input className={styles.input} type="text" name="phone" value={displayData.phone} onChange={handleChange} /></p>
                    <p className={styles.subtitleSectionDroite}>Name : <input className={styles.input} type="text" name="name" value={displayData.name} onChange={handleChange} /></p>
                    <p className={styles.subtitleSectionDroite}>Surname : <input className={styles.input} type="text" name="surname" value={displayData.surname} onChange={handleChange} /></p>
                    <br></br>
                    <p className={styles.titleSectionDroite}>Description : <textarea className={styles.input} name="description" value={displayData.description} onChange={handleChange} /></p>

                    <br></br>
                    <h4 className={styles.titleSectionDroite}>Address :</h4>
                    <p className={styles.subtitleSectionDroite}>Street Number : <input className={styles.input} type="text" name="streetNumber" value={displayData.address.streetNumber} onChange={handleChange} /></p>
                    <p className={styles.subtitleSectionDroite}>Street : <input className={styles.input} type="text" name="street" value={displayData.address.street} onChange={handleChange} /></p>
                    <p className={styles.subtitleSectionDroite}>Postal Code : <input className={styles.input} type="text" name="postalCode" value={displayData.address.postalCode} onChange={handleChange} /></p>
                    <p className={styles.subtitleSectionDroite}>City : <input className={styles.input} type="text" name="city" value={displayData.address.city} onChange={handleChange} /></p>
                    <p className={styles.subtitleSectionDroite}>Country : <input className={styles.input} type="text" name="country" value={displayData.address.country} onChange={handleChange} /></p>
                </div>
                
            )}

            {/* L'email est modifiable pour les 2 rôles */}
            {user.role === "studio" && (
                <>
                    <br /><br />
                    <h4 className={styles.titleSectionDroite}>Contact : </h4>
                    <p className={styles.subtitleSectionDroite}>Email : <input className={styles.input} type="email" name="email" value={displayData.email} onChange={handleChange} /></p>
                </>
            )}

                    <br /><br />
                    <h4 className={styles.titleSectionDroite}>Social Links :</h4>
                    <p className={styles.subtitleSectionDroite}>Facebook :&nbsp;  
                        <input className={styles.input} type="text" name="socialLinks[0]" value={displayData.socialLinks[0] ? displayData.socialLinks[0].url : ''} onChange={handleChange}/>
                    </p>
                    <p className={styles.subtitleSectionDroite}>Twitter :&nbsp; 
                        <input className={styles.input} type="text" name="socialLinks[1]" value={displayData.socialLinks[1] ? displayData.socialLinks[1].url : ''} onChange={handleChange}/>
                    </p>
                    <p className={styles.subtitleSectionDroite}>Instagram :&nbsp;
                        <input className={styles.input} type="text" name="socialLinks[2]" value={displayData.socialLinks[2] ? displayData.socialLinks[2].url : ''} onChange={handleChange}/>
                    </p>
                    <p className={styles.subtitleSectionDroite}>LinkedIn :&nbsp; 
                        <input className={styles.input} type="text" name="socialLinks[3]" value={displayData.socialLinks[3] ? displayData.socialLinks[3].url : ''} onChange={handleChange}/>
                    </p>
                    <p className={styles.subtitleSectionDroite}>YouTube :&nbsp; 
                        <input className={styles.input} type="text" name="socialLinks[4]" value={displayData.socialLinks[4] ? displayData.socialLinks[4].url : ''} onChange={handleChange}/>
                    </p>
                    <p className={styles.subtitleSectionDroite}>GitHub :&nbsp; 
                        <input className={styles.input} type="text" name="socialLinks[5]" value={displayData.socialLinks[5] ? displayData.socialLinks[5].url : ''} onChange={handleChange}/>
                    </p>
                    <br/><br/>

                    {/* Section spécifique aux studios */}
                    {user.role === "studio" && (
                        <>
                            <br /><br />
                            <h4 className={styles.titleSectionDroite}>Studio Informations :</h4>
                            <p className={styles.subtitleSectionDroite} >Company Name : <span className={styles.span}>{formData.studio.companyName}</span></p>
                            <p className={styles.subtitleSectionDroite} >Address : <span className={styles.span}>{`${formData.studio.address.street}, ${formData.studio.address.postalCode} ${formData.studio.address.city}, ${formData.studio.address.country}`}</span></p>
                            <p className={styles.subtitleSectionDroite} >SIRET : <span className={styles.span}>{formData.studio.siret}</span></p>
                            <p className={styles.subtitleSectionDroite} >SIREN : <span className={styles.span}>{formData.studio.siren}</span></p>
                            <p className={styles.subtitleSectionDroite} >Website : <input className={styles.input} type="text" name="studio.webSite" value={displayData.studio.webSite} onChange={handleChange} /></p>
                            <p className={styles.subtitleSectionDroite} >Description : <textarea className={styles.input} name="studio.description" value={displayData.studio.description} onChange={handleChange} /></p>
                            
                            <br /><br />
                            <h4 className={styles.titleSectionDroite}>Contact Person :</h4>
                            <p className={styles.subtitleSectionDroite}> Name : <input className={styles.input} type="text" name="studio.contactPerson.name" value={displayData.studio.contactPerson.name} onChange={handleChange} /></p>
                            <p className={styles.subtitleSectionDroite}>Surname : <input className={styles.input} type="text" name="studio.contactPerson.surname" value={displayData.studio.contactPerson.surname} onChange={handleChange} /></p>
                            <p className={styles.subtitleSectionDroite}>Email : <input className={styles.input} type="email" name="studio.contactPerson.email" value={displayData.studio.contactPerson.email} onChange={handleChange} /></p>
                            <p className={styles.subtitleSectionDroite} >Phone : <input className={styles.input} type="text" name="studio.contactPerson.phone" value={displayData.studio.contactPerson.phone} onChange={handleChange} /></p>

                            <br /><br />
                            <h4 className={styles.titleSectionDroite}>Contact Manager :</h4>
                            <p className={styles.subtitleSectionDroite}  >Name : <input className={styles.input} type="text" name="studio.contactManager.name" value={displayData.studio.contactManager.name} onChange={handleChange} /></p>
                            <p className={styles.subtitleSectionDroite}  >Surname : <input className={styles.input} type="text" name="studio.contactManager.surname" value={displayData.studio.contactManager.surname} onChange={handleChange} /></p>
                            <p className={styles.subtitleSectionDroite}  >Email : <input className={styles.input} type="email" name="studio.contactManager.email" value={displayData.studio.contactManager.email} onChange={handleChange} /></p>
                            <p className={styles.subtitleSectionDroite}  >Phone : <input className={styles.input} type="text" name="studio.contactManager.phone" value={displayData.studio.contactManager.phone} onChange={handleChange} /></p>
                            <br /><br />

                        </>
                    )}
                            <button className={styles.button} onClick={handleSave}>Save</button>
                            <button className={styles.button} onClick={handleCancel}>Cancel</button>
                            <br/><br/>
                 </div>
            ) : (
                <div className={styles.sectionDroite}> {/* Affichage des informations lorsque l'édition n'est pas activée */}
                   {/* Pour les 2 roles */}
                   <br /><br />
                   <h4 className={styles.titleSectionDroite}>Contact : </h4>
                    <p className={styles.subtitleSectionDroite}>Email : <span className={styles.span}>{formData.email}</span></p> 

                    {/* Juste pour le patron */}
                    {user.role === "patron" && (
                        <>
                            <p className={styles.subtitleSectionDroite}>Phone : <span className={styles.span}>{formData.phone}</span></p>
                            <p className={styles.subtitleSectionDroite}>Name : <span className={styles.span}>{formData.name}</span></p>
                            <p className={styles.subtitleSectionDroite}>Surname : <span className={styles.span}>{formData.surname}</span></p>
                            <br></br>
                            <p className={styles.titleSectionDroite}>Description : <span className={styles.span}>{formData.description}</span></p>

                            <br /><br />
                            <h4 className={styles.titleSectionDroite}>Address :</h4>
                            <p className={styles.subtitleSectionDroite}>Street Number : <span className={styles.span}>{formData.address.streetNumber}</span></p>
                            <p className={styles.subtitleSectionDroite}>Street : <span className={styles.span}>{formData.address.street}</span></p>
                            <p className={styles.subtitleSectionDroite}>Postal Code : <span className={styles.span}>{formData.address.postalCode}</span></p>
                            <p className={styles.subtitleSectionDroite}>City : <span className={styles.span}>{formData.address.city}</span></p>
                            <p className={styles.subtitleSectionDroite}>Country : <span className={styles.span}>{formData.address.country}</span></p>
                        </>
                    )} 
                    
                    {/* Section spécifique aux studios */}
                    {user.role === "studio" && (
                        <>
                            <br /><br />
                            <h4 className={styles.titleSectionDroite}>Studio Informations : </h4>
                            <p className={styles.subtitleSectionDroite} >Company Name : <span className={styles.span}>{formData.studio.companyName}</span></p>
                            <p className={styles.subtitleSectionDroite} >Address : <span className={styles.span}>{`${formData.studio.address.street}, ${formData.studio.address.postalCode} ${formData.studio.address.city}, ${formData.studio.address.country}`}</span></p> 
                            <p className={styles.subtitleSectionDroite} >SIRET : <span className={styles.span}>{formData.studio.siret}</span></p>
                            <p className={styles.subtitleSectionDroite} >SIREN : <span className={styles.span}>{formData.studio.siren}</span></p>
                            <p className={styles.subtitleSectionDroite} >Website : <span className={styles.span}>{formData.studio.webSite}</span></p>
                            <p className={styles.subtitleSectionDroite} >Description : <span className={styles.span}>{formData.studio.description}</span></p>
                            
                            <br /><br />
                            <h4 className={styles.titleSectionDroite}>Contact Person :</h4>
                            <div>
                                <p className={styles.subtitleSectionDroite}>Name : <span className={styles.span}>{displayData.studio.contactPerson.name}</span></p>
                                <p className={styles.subtitleSectionDroite}>Surname : <span className={styles.span}>{displayData.studio.contactPerson.surname}</span></p>
                                <p className={styles.subtitleSectionDroite}>Email : <span className={styles.span}>{displayData.studio.contactPerson.email}</span></p>
                                <p className={styles.subtitleSectionDroite}>Phone : <span className={styles.span}>{displayData.studio.contactPerson.phone}</span></p>
                            </div>

                            <br /><br />
                            <h4 className={styles.titleSectionDroite}>Contact Manager :</h4>
                            <div>
                                <p className={styles.subtitleSectionDroite}>Name : <span className={styles.span}>{displayData.studio.contactManager.name}</span></p>
                                <p className={styles.subtitleSectionDroite}>Surname : <span className={styles.span}>{displayData.studio.contactManager.surname}</span></p>
                                <p className={styles.subtitleSectionDroite}>Email : <span className={styles.span}>{displayData.studio.contactManager.email}</span></p>
                                <p className={styles.subtitleSectionDroite}>Phone : <span className={styles.span}>{displayData.studio.contactManager.phone}</span></p>
                            </div>        
                </>
            )}
             
                            {/* Pour les 2 roles */}
                            <br /><br /> 
                            <h4 className={styles.titleSectionDroite}>Social Links :</h4>
                            <div className={styles.socialItem}>
                            <a href="#" className={styles.socialIconFacebook}><FaFacebook /></a>
                            <p className={styles.subtitleSectionDroite}>Facebook : <span className={styles.span}>{formData.socialLinks[0] ? formData.socialLinks[0].url : ''}</span></p>
                            </div>
                            <div className={styles.socialItem}>
                            <a href="#" className={styles.socialIconTwitter}><FaTwitter /></a>
                            <p className={styles.subtitleSectionDroite}>Twitter : <span className={styles.span}>{formData.socialLinks[1] ? formData.socialLinks[1].url : ''}</span></p>
                            </div>
                            <div className={styles.socialItem}>
                            <a href="#" className={styles.socialIconInstagram}><FaInstagram /></a>
                            <p className={styles.subtitleSectionDroite}>Instagram : <span className={styles.span}>{formData.socialLinks[2] ? formData.socialLinks[2].url : ''}</span></p>
                            </div>
                            <div className={styles.socialItem}>
                            <a href="#" className={styles.socialIconLinkedin}><FaLinkedin /></a>
                            <p className={styles.subtitleSectionDroite}>LinkedIn : <span className={styles.span}>{formData.socialLinks[3] ? formData.socialLinks[3].url : ''}</span></p>
                            </div>
                            <div className={styles.socialItem}>
                            <a href="#" className={styles.socialIconYoutube}><FaYoutube /></a>
                            <p className={styles.subtitleSectionDroite}>YouTube : <span className={styles.span}>{formData.socialLinks[4] ? formData.socialLinks[4].url : ''}</span></p>
                            </div>
                            <div className={styles.socialItem}>
                            <a href="#" className={styles.socialIconGithub}><FaGithub /></a>
                            <p className={styles.subtitleSectionDroite}> GitHub : <span className={styles.span}>{formData.socialLinks[5] ? formData.socialLinks[5].url : ''}</span></p>
                            </div>
                            <br/><br/>

                             <div>
                            {/* Boutons pour activer l'édition ou enregistrer et annuler les modifications */}  
                            <button className={styles.button} onClick={startEditing}>Modify my informations</button>
                            <br/><br/> 
                            </div>
                        </div>
                         )}
                  </div> {/* Fin div conteneurSections*/}       


            <br/><br/>
            <h4 className={styles.titleProjects}>Favorite Projects :</h4>
            {user.followedProjects?.length > 0 ? (
                user.followedProjects.map((proj, i) => <ProjectCard key={i} project={proj} />)
            ) : (
                <p className={styles.noProjectsYet}>You don't have any favorite project yet</p>
            )}

            <br/><br/>

            {/* Section spécifique aux patrons */}
            {user.role === "patron" && (
                <>
                   <h4 className={styles.titleProjects}>Funded Projects :</h4>
                    {user.fundedProjects?.length > 0 ? (
                              user.fundedProjects.map((proj, i) => <ProjectCard key={i} project={proj.project} />)
                            ) : (
                              <p className={styles.noProjectsYet}>You did not fund any project yet</p>
                            )}

            <br/><br/>
        
                   <h4 className={styles.titleProjects}>Created Projects :</h4>
                    {user.createdProjects && user.createdProjects.length > 0 ? (
                              user.createdProjects.map((proj, i) => <ProjectCard key={i} project={proj} />)
                            ) : (
                            <p className={styles.noProjectsYet}>You have not created any project yet</p>
                            )}
                </>
)}


            {/* Section spécifique aux studios */}
            {user.role === "studio" && (
                <>
                    <h4 className={styles.titleProjects}>Chosen Projects :</h4>
                    {user.studio?.chosenProjects?.length > 0 ? (
                            user.studio.chosenProjects.map((proj, i) => <ProjectCard key={i} project={proj} />)
                    ) : (
                        <p className={styles.noProjectsYet}>No chosen projects yet</p>
                    )}

                    <br/><br/>
                    <h4 className={styles.titleProjects}>Developed Projects :</h4>
                    {user.studio?.developedProjects?.length > 0 ? (
                            user.studio.developedProjects.map((proj, i) => <ProjectCard key={i} project={proj} />
                            )
                    ) : (
                        <p className={styles.noProjectsYet}>No developed projects yet</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Account;