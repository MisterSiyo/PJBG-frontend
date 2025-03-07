import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from '../styles/project.module.css';

function ProjectValidated() {
    const [chatMessage, setChatMessage] = useState('');
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [stages, setStages] = useState([]);

    const router = useRouter();
    const { project } = router.query;
    const [projectData, setProjectData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState('');
    const [news, setNews] = useState([]);
    const userAccount = useSelector((state) => state.user.value);

    useEffect(() => {
        if (!project) return;

        fetch(`http://localhost:3000/projects/${project}`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setProjectData(data.project);
                    setNews(data.project.histories);
                    setStages(data.project.stages || []);
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

    const handleSubmitUpdate = async () => {
        if (!updateTitle.trim() || !updateContent.trim()) {
            alert("Title and content cannot be empty.");
            return;
        }

        const response = await fetch(`http://localhost:3000/projects/update/${projectData._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: updateTitle,
                content: updateContent,
                token: userAccount.token
            })
        });

        const data = await response.json();
        if (response.ok) {
            setStages([...stages, { title: updateTitle, content: updateContent, date: new Date() }]);
            setUpdateTitle("");
            setUpdateContent("");
        } else {
            alert("Error posting update: " + data.message);
        }
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
                </div>

                {/* Mises à jour du développement */}
                <div className={styles.centerBar}>
                    <h3>Development Updates</h3>

                    {/* Formulaire pour les studios */}
                    {userAccount.role === "studio" && (
                        <div className={styles.updateForm}>
                            <h4>Add a new update</h4>
                            <input
                                type="text"
                                placeholder="Update Title"
                                value={updateTitle}
                                onChange={(e) => setUpdateTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Write a progress update..."
                                value={updateContent}
                                onChange={(e) => setUpdateContent(e.target.value)}
                            />
                            <button onClick={handleSubmitUpdate}>Submit Update</button>
                        </div>
                    )}

                    {/* Affichage de l'historique des mises à jour */}
                    <h4>Update History</h4>
                    <ul>
                        {stages.map((stage, index) => (
                            <li key={index}>
                                <strong>{stage.title}</strong> - {new Date(stage.date).toLocaleDateString()}
                                <p>{stage.content}</p>
                            </li>
                        ))}
                    </ul>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProjectValidated;
