import styles from '../styles/auth.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import SiretCheck from '../components/SiretCheck';
import UserForm from '../components/userForm';


export default function SignupDev() {
    const router = useRouter();
    const [companyInfo, setCompanyInfo] = useState(null);

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.titleSection}>Developer Registration</h2>
            <br></br>
            <SiretCheck onCompanyInfoChange={setCompanyInfo} />
            <UserForm onSubmit={() => router.push('/')} companyInfo={companyInfo} />
        </div>
    );
}
