import styles from '../styles/project.module.css';
import { useRouter } from 'next/router';

export default function ProjectInfo(props) {
    const router = useRouter();
    let totalContributed = 10000
    let percent = totalContributed / props.goal * 100 
    //a créer, a pour but d'être un résumé du projet avec catégories et resumé peut etre une photo ?
    return (
        <div className={styles.projectCard} onClick={() => router.push(`/projects/${props.title}`)}>
            <h3>{props.title}</h3>
            <p>{props.pitch}</p>
            <div>
                <p>{percent}</p>
                <p>{totalContributed}</p>
                <p>{props.goal}</p>
            </div>
        </div>
    );
}
