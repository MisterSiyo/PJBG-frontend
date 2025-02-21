import styles from '../styles/project.module.css';
import { useState } from 'react';

export default function ValidateCompany() {
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
            const response = await fetch(`https://api.societe.com/v1/siret/${siret}?apikey=YOUR_API_KEY`); // a racorder avec une clé API
            if (!response.ok) throw new Error('SIRET introuvable');
            
            const data = await response.json();
            setCompanyInfo(data);
        } catch (err) {
            setCompanyInfo(null);
            setError('Impossible de récupérer les informations.');
        }
    };

    return (
        <div className={styles.siretCheckContainer}>
            <h3>informations Entreprise</h3>
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
                <div>
                    <h4>{companyInfo.nom}</h4>
                    <p><strong>Adresse:</strong> {companyInfo.adresse}</p>
                    <p><strong>Statut:</strong> {companyInfo.statut}</p>
                </div>
            )}
        </div>
    );
}
