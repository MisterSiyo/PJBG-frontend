import Account from '../components/Account';
import styles from '../styles/account.module.css'

//Page account qui affiche simplement le composant <Account />. => définir la structure de la page & => URL /account. En résumé, ce fichier s’occupe du rendu global de la page.

export default function account() {
    return (
        <div className={styles.mainContainer}>
            < Account/>
        </div>
    );
}