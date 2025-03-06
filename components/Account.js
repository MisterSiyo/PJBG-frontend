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
        gamingPreferences: []
    });

    useEffect(() => {
        if (user) {
            setFormData({
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
                },
                socialLinks: [
                    { platform: 'Facebook', url: user.socialLinks?.Facebook || '' },
                    { platform: 'Twitter', url: user.socialLinks?.Twitter || '' },
                    { platform: 'Instagram', url: user.socialLinks?.Instagram || '' },
                    { platform: 'LinkedIn', url: user.socialLinks?.LinkedIn || '' },
                    { platform: 'YouTube', url: user.socialLinks?.YouTube || '' },
                    { platform: 'GitHub', url: user.socialLinks?.GitHub || '' }
                ],
                gamingPreferences: user.gamingPreferences || []
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in formData.address) {
            setFormData(prevState => ({
                ...prevState,
                address: { ...prevState.address, [name]: value },
            }));
        } else if (name in formData.socialLinks) {
            setFormData(prevState => ({
                ...prevState,
                socialLinks: { ...prevState.socialLinks, [name]: value },
            }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSave = () => {
        const dataToSave = { ...formData, token: user.token };

        fetch(`http://localhost:3000/account/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
        .then(response => response.json())
        .then(data => {
            if (!data) return;
            dispatch(updateUser(dataToSave));
        });
        
        setIsEditing(false);
    };

    return (
        <div className={styles.accountPage}>
            <h1>My Account</h1>
            <br />
            <div>
                <p>Username : {user.username || 'Not specified'}</p>
            </div>
            <br />
            {isEditing ? (
                <>
                    <p>Email : <input type="email" name="email" value={formData.email} onChange={handleChange} /></p>
                    <p>Phone : <input type="text" name="phone" value={formData.phone} onChange={handleChange} /></p>
                    <p>Name : <input type="text" name="name" value={formData.name} onChange={handleChange} /></p>
                    <p>Surname : <input type="text" name="surname" value={formData.surname} onChange={handleChange} /></p>
                    <p>Description : <input name="description" value={formData.description} onChange={handleChange} /></p>

                    <h4>Address :</h4>
                    <p>Street Number : <input type="text" name="streetNumber" value={formData.address.streetNumber} onChange={handleChange} /></p>
                    <p>Street : <input type="text" name="street" value={formData.address.street} onChange={handleChange} /></p>
                    <p>Postal Code : <input type="text" name="postalCode" value={formData.address.postalCode} onChange={handleChange} /></p>
                    <p>City : <input type="text" name="city" value={formData.address.city} onChange={handleChange} /></p>
                    <p>Country : <input type="text" name="country" value={formData.address.country} onChange={handleChange} /></p>

                    <h4>Social Links :</h4>
                    <p>Facebook : 
                        <input 
                            type="text" 
                            name="socialLinks[0]" 
                            data-platform="Facebook" 
                            value={formData.socialLinks[0] ? formData.socialLinks[0].url : ''} 
                            onChange={handleChange} 
                        />
                    </p>
                    <p>Twitter : 
                        <input 
                            type="text" 
                            name="socialLinks[1]" 
                            data-platform="Twitter" 
                            value={formData.socialLinks[1] ? formData.socialLinks[1].url : ''} 
                            onChange={handleChange} 
                        />
                    </p>
                    <p>Instagram : 
                        <input 
                            type="text" 
                            name="socialLinks[2]" 
                            data-platform="Instagram" 
                            value={formData.socialLinks[2] ? formData.socialLinks[2].url : ''} 
                            onChange={handleChange} 
                        />
                    </p>
                    <p>LinkedIn : 
                        <input 
                            type="text" 
                            name="socialLinks[3]" 
                            data-platform="LinkedIn" 
                            value={formData.socialLinks[3] ? formData.socialLinks[3].url : ''} 
                            onChange={handleChange} 
                        />
                    </p>
                    <p>YouTube : 
                        <input 
                            type="text" 
                            name="socialLinks[4]" 
                            data-platform="YouTube" 
                            value={formData.socialLinks[4] ? formData.socialLinks[4].url : ''} 
                            onChange={handleChange} 
                        />
                    </p>
                    <p>GitHub : 
                        <input 
                            type="text" 
                            name="socialLinks[5]" 
                            data-platform="GitHub" 
                            value={formData.socialLinks[5] ? formData.socialLinks[5].url : ''} 
                            onChange={handleChange} 
                        />
                    </p>

                </>
            ) : (
                <>
                    <p>Email : {formData.email}</p>
                    <p>Phone : {formData.phone}</p>
                    <p>Name : {formData.name}</p>
                    <p>Surname : {formData.surname}</p>
                    <p>Description : {formData.description}</p>

                    <br /><br /><br />
                    <h4>Address :</h4>
                    <p>Street Number : {formData.address.streetNumber}</p>
                    <p>Street : {formData.address.street}</p>
                    <p>Postal Code : {formData.address.postalCode}</p>
                    <p>City : {formData.address.city}</p>
                    <p>Country : {formData.address.country}</p>
                    
                    <br /><br /><br />
                    <h4>Social Links :</h4>
                    <p>Facebook : {formData.socialLinks[0] ? formData.socialLinks[0].url : ''}</p>
                    <p>Twitter : {formData.socialLinks[1] ? formData.socialLinks[1].url : ''}</p>
                    <p>Instagram : {formData.socialLinks[2] ? formData.socialLinks[2].url : ''}</p>
                    <p>LinkedIn : {formData.socialLinks[3] ? formData.socialLinks[3].url : ''}</p>
                    <p>YouTube : {formData.socialLinks[4] ? formData.socialLinks[4].url : ''}</p>
                    <p>GitHub : {formData.socialLinks[5] ? formData.socialLinks[5].url : ''}</p>
                </>
            )}

            <br />
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)}>Modify my informations</button>
            ) : (
                <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            )}

            <br /><br /><br />

            <h4>Funded projects :</h4>
            <ul>
                {user.fundedProjects && user.fundedProjects.length > 0 && (
                    <>
                        {user.fundedProjects[0] && <li>{user.fundedProjects[0].name} - {user.fundedProjects[0].amount}€ on {new Date(user.fundedProjects[0].date).toLocaleDateString()}</li>}
                        {user.fundedProjects[1] && <li>{user.fundedProjects[1].name} - {user.fundedProjects[1].amount}€ on {new Date(user.fundedProjects[1].date).toLocaleDateString()}</li>}
                        {user.fundedProjects[2] && <li>{user.fundedProjects[2].name} - {user.fundedProjects[2].amount}€ on {new Date(user.fundedProjects[2].date).toLocaleDateString()}</li>}
                    </>
                )}
            </ul>

            <h4>Projects created :</h4>
            <ul>
                {user.createdProjects && user.createdProjects.length > 0 && (
                    <>
                        {user.createdProjects[0] && <li>{user.createdProjects[0].name} - Created on {new Date(user.createdProjects[0].creationDate).toLocaleDateString()}</li>}
                        {user.createdProjects[1] && <li>{user.createdProjects[1].name} - Created on {new Date(user.createdProjects[1].creationDate).toLocaleDateString()}</li>}
                        {user.createdProjects[2] && <li>{user.createdProjects[2].name} - Created on {new Date(user.createdProjects[2].creationDate).toLocaleDateString()}</li>}
                    </>
                )}
            </ul>

            <h4>Favorite projects :</h4>
            <ul>
                {user.favoriteProjects && user.favoriteProjects.length > 0 && (
                    <>
                        {user.favoriteProjects[0] && <li>{user.favoriteProjects[0].name}</li>}
                        {user.favoriteProjects[1] && <li>{user.favoriteProjects[1].name}</li>}
                        {user.favoriteProjects[2] && <li>{user.favoriteProjects[2].name}</li>}
                    </>
                )}
            </ul>

            <h4>My Game Genre Preferences :</h4>
        </div>
    );
};

export default Account;
