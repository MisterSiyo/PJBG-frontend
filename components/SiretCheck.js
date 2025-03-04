import styles from '../styles/project.module.css';
import { useState } from 'react';

const API_BASE_URL = "https://api.societe.com/api/v1";
const API_KEY = process.env.NEXT_PUBLIC_CLE_API_SOCIETE;

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
            const response = await fetch(`${API_BASE_URL}/entreprise/${siret}/infoslegales`, {
                method: 'GET',
                headers: {
                    'X-Authorization': `socapi ${API_KEY}`
                }
            });

            if (!response.ok) throw new Error('SIRET introuvable');

            const data = await response.json();

            setCompanyInfo({
                name: data.infolegales.denoinsee,
                siren: data.infolegales.sirenformat,
                siret: data.infolegales.siretsiegeformat,
                numtva: data.infolegales.numtva,
                status: data.infolegales.status,
                capital: `${data.infolegales.capital} ${data.infolegales.libdevise}`,
                naf: `${data.infolegales.nafinsee} - ${data.infolegales.naflibinsee}`,
                rcs: data.infolegales.rcs,
                greffe: `${data.infolegales.nomgreffe} (${data.infolegales.codegreffe})`,
                address: `${data.infolegales.voieadressagercs}, ${data.infolegales.codepostalrcs} ${data.infolegales.villercs}, ${data.infolegales.paysrcs}`
            });

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
                    <p><strong>SIREN:</strong> {companyInfo.siren}</p>
                    <p><strong>SIRET:</strong> {companyInfo.siret}</p>
                    <p><strong>Numéro TVA:</strong> {companyInfo.numtva}</p>
                    <p><strong>Statut:</strong> {companyInfo.status}</p>
                    <p><strong>Capital Social:</strong> {companyInfo.capital}</p>
                    <p><strong>Code NAF:</strong> {companyInfo.naf}</p>
                    <p><strong>RCS:</strong> {companyInfo.rcs}</p>
                    <p><strong>Greffe:</strong> {companyInfo.greffe}</p>
                    <p><strong>Adresse:</strong> {companyInfo.address}</p>
                </div>
            )}
        </div>
    );
}
