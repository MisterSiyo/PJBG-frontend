import styles from '../styles/auth.module.css';
import { useState } from 'react';
import SiretCheck from '../components/SiretCheck';
import UserForm from '../components/userForm';

export default function SignupDev() {
    const [companyInfo, setCompanyInfo] = useState(null);

    return (
        <div className={styles.authContainer}>
            <h2>Inscription Développeur</h2>
            <SiretCheck onCompanyInfoChange={setCompanyInfo} />
            <UserForm onSubmit={() => router.push('/')} companyInfo={companyInfo} />
        </div>
    );
}
