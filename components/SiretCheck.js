import styles from '../styles/project.module.css';
import { useState } from 'react';

const API_SIRET_URL = "http://localhost:3000/users";

export default function SiretCheck({ onCompanyInfoChange }) {
    const [siret, setSiret] = useState('');
    const [companyInfo, setCompanyInfo] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (siret.length !== 14 || isNaN(siret)) {
            setError('Le SIRET doit contenir 14 chiffres.');
            return;
        }

        setError('');
        try {
            const response = await fetch(`${API_SIRET_URL}/siret/${siret}`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('SIRET introuvable');

            const data = await response.json();
            setCompanyInfo(data);
            onCompanyInfoChange(data);  // Envoi des données à `SignupForm`

        } catch (err) {
            setCompanyInfo(null);
            setError('Impossible de récupérer les informations.');
        }
    };

    return (
        <div className={styles.siretCheckContainer}>
            <h3>Informations Entreprise</h3>
            <input
                type="text"
                placeholder="Entrez un numéro SIRET"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                className={styles.authInput}
            />
            <button onClick={handleSearch} className={styles.authButton}>
                Vérifier
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {companyInfo && (
                <div className={styles.companyDetails}>
                    <h4>{companyInfo.name}</h4>
                    <p><strong>NAME:</strong> {companyInfo.companyName}</p>
                    <p><strong>SIREN:</strong> {companyInfo.siren}</p>
                    <p><strong>SIRET:</strong> {companyInfo.siret}</p>
                    <p><strong>Numéro TVA:</strong> {companyInfo.numtva}</p>
                    <p><strong>Statut:</strong> {companyInfo.status}</p>
                    <p><strong>Code NAF:</strong> {companyInfo.naf}</p>
                    <p><strong>Adresse:</strong> {`${companyInfo.address.street}, ${companyInfo.address.postalCode} ${companyInfo.address.city}, ${companyInfo.address.country}`}</p>
                </div>
            )}
        </div>
    );
}
