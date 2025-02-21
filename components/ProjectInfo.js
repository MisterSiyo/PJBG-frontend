import styles from '../styles/project.module.css';
import { useRouter } from 'next/router';

export default function ProjectInfo() {
    const router = useRouter();

    //a créer, a pour but d'être un résumé du projet avec catégories et resumé peut etre une photo ?
    return (
        <div className={styles.projectCard} onClick={() => router.push('/project')}>
            <h3>Nom du Projet</h3>
            <p>Description courte du projet...</p>
        </div>
    );
}
