import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from '../styles/project.module.css';


function ProjectValidated() {
    const [chatMessage, setChatMessage] = useState('');
    const router = useRouter();
    const { project } = router.query;
    const [projectData, setProjectData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState('');
    const [news, setNews] = useState([]);
    const [showCharacteristics, setShowCharacteristics] = useState(false); // État pour afficher les caractéristiques
    const userAccount = useSelector((state) => state.user.value);

    useEffect(() => {
        if (!project) return;

        fetch(`http://localhost:3000/projects/${project}`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setProjectData(data.project);
                    setNews(data.project.histories);
                }
                setIsLoading(false);
            });
    }, [project]);

    const handleInputChange = (e) => {
        if (chatMessage.length < 120 || key === "Backspace") {
            setChatMessage(e.target.value);
        }
    };

    const handleChat = () => {
        if (chatMessage.length < 1) return;

        fetch(`http://localhost:3000/projects/messages/${project}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userAccount.token, message: chatMessage }),
        }).then(response => response.json())
            .then(data => {
                setNews([...news, data.updatedMessage]);
                setChatMessage('');
            });
    };

    if (isLoading) return <div>Loading...</div>;
    if (!projectData) return <div>Project not found</div>;

    return (
        <>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>{projectData.title}</h2>
            </div>

            <div className={styles.pageContent}>
                {/* LEFT BAR - Créateur */}
                <div className={styles.leftBar}>
                    <div className={styles.creatorContainer}>
                        <h3>Project Creator</h3>
                        <p><strong>Username:</strong> {projectData.user.username}</p>
                        <p><strong>Description:</strong> {projectData.user.description || "No description available."}</p>
                    </div>

                    {/* Bouton pour afficher les caractéristiques */}
                    <div className={styles.characContainer}>
                        <button onClick={() => setShowCharacteristics(!showCharacteristics)} className={styles.characButton}>
                            {showCharacteristics ? "Hide Characteristics" : "Show Characteristics"}
                        </button>

                        {showCharacteristics && (
                            <div className={styles.characList}>
                                {projectData.detail.gameMechanics.map((mechanic, i) => (
                                    <div key={i} className={styles.characItem}>
                                        <strong>{mechanic.name}</strong>
                                        <p>{mechanic.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT BAR - Chat */}
                <div className={styles.rightBar}>
                    <div className={styles.NewschatContainer}>
                        <h5>News & Chat</h5>
                        <div className={styles.NewsChatBox}>
                            {news.map((data, i) => (
                                <div key={i} className={styles.messageContainer}>
                                    <p className={styles.userposting}>{data.userPosting.username} - {data.userPosting.role}</p>
                                    <p className={styles.message}>{data.message}</p>
                                    <p className={styles.messageDate}>{new Date(data.date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.chattingBox}>
                            <input 
                                placeholder='Chat here...' 
                                className={styles.messageInput} 
                                onChange={handleInputChange} 
                                value={chatMessage} 
                                onKeyDown={(e) => setKey(e.key)}
                            />
                            <button className={styles.send} onClick={handleChat}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProjectValidated;
