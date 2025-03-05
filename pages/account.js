import styles from '../styles/layout.module.css';  
import Account from '../components/Account';

//Page account qui affiche simplement le composant <Account />. => définir la structure de la page & => URL /account. En résumé, ce fichier s’occupe du rendu global de la page.

export default function account() {
    return (
        <div className={styles.mainContainer}>
            < Account/>
        </div>
    );
}