import styles from '../styles/project.module.css';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ProjectCard({ projectId }) {
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchProject = async () => {
            try {
                const response = await fetch(`$http://localhost:3000/projects/${projectId}`);
                const data = await response.json();
                if (data.result) {
                    setProject(data.project);
                } else {
                    setError('Project not found');
                }
            } catch (error) {
                setError('Error fetching project data');
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    if (loading) return <p>Loading project...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!project) return <p>No project data available.</p>;

    // Image par défaut pour le créateur (à remplacer plus tard)
    const defaultCreatorImage = '/default-profile.png';

    // Vérification que project et ses propriétés existent
    const progressions = Array.isArray(project.progressions) ? project.progressions : [];
    const histories = Array.isArray(project.histories) ? project.histories : [];
    const categories = Array.isArray(project.categories) ? project.categories : [];

    // Calcul du total des contributions à partir des progressions
    const totalCollected = progressions.reduce((acc, contribution) => acc + (contribution.amount || 0), 0);
    const fundingPercentage = project.goal ? Math.round((totalCollected / project.goal) * 100) : 0;

    // Trier les news par date décroissante
    const sortedNews = histories.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className={styles.projectCard} onClick={() => router.push(`/project/${project.pageURL}`)}>
            <img src={defaultCreatorImage} alt="Creator" className={styles.creatorImage} onError={(e) => e.target.src = defaultCreatorImage} />
            <button className={styles.newsButton} onClick={(e) => { e.stopPropagation(); setShowPopover(!showPopover); }}>!</button>
            <h3>{project.title || 'No Title'}</h3>
            <p>{project.pitch || 'No Description Available'}</p>
            <div className={styles.categories}>
                {categories.length > 0 ? categories.map((category, index) => (
                    <span key={index} className={styles.category}>{category}</span>
                )) : <p>No categories</p>}
            </div>
            <div className={styles.fundingBarContainer}>
                <div className={styles.fundingBar} style={{ width: `${fundingPercentage}%` }}></div>
            </div>
            <p>{fundingPercentage}% | {totalCollected.toLocaleString()}€ / {project.goal?.toLocaleString() || 'N/A'}€</p>
            {showPopover && (
                <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
                    <h4>Latest News</h4>
                    {sortedNews.length > 0 ? (
                        sortedNews.map((news, index) => (
                            <p key={index}>{news.message}</p>
                        ))
                    ) : (
                        <p>No recent news.</p>
                    )}
                </div>
            )}
        </div>
    );
}
