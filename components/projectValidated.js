import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from '../styles/project.module.css';

function ProjectValidated() {
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateCategory, setUpdateCategory] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [roadmapUpdate, setRoadmapUpdate] = useState('');
    const [communityEngagement, setCommunityEngagement] = useState('');
    const [closingNotes, setClosingNotes] = useState('');
    const [stages, setStages] = useState([]);

    const router = useRouter();
    const { project } = router.query;
    const [projectData, setProjectData] = useState(null);
    const userAccount = useSelector((state) => state.user.value);

    useEffect(() => {
        if (!project) return;

        fetch(`http://localhost:3000/projects/${project}`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setProjectData(data.project);
                    setStages(data.project.stages || []);
                }
            });
    }, [project]);

    const handleSubmitUpdate = async () => {
        if (!updateTitle.trim() || !updateContent.trim() || !updateCategory) {
            alert("Please fill all required fields.");
            return;
        }

        const response = await fetch(`http://localhost:3000/projects/update/${projectData._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: updateTitle,
                category: updateCategory,
                content: updateContent,
                roadmapUpdate,
                communityEngagement,
                closingNotes,
                token: userAccount.token
            })
        });

        if (response.ok) {
            setStages([...stages, { title: updateTitle, category: updateCategory, content: updateContent, roadmapUpdate, communityEngagement, closingNotes }]);
            setUpdateTitle("");
            setUpdateCategory("");
            setUpdateContent("");
            setRoadmapUpdate("");
            setCommunityEngagement("");
            setClosingNotes("");
        } else {
            alert("Error posting update.");
        }
    };

    if (!projectData) return <div>Project not found</div>;

    return (
        <>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>{projectData.title}</h2>
            </div>

            <div className={styles.pageContent}>
                {/* Sections Updates */}
                <div className={styles.centerBar}>
                    <h3>Development Updates</h3>

                    {/* Formulaire pour les studios */}
                    {userAccount.role === "studio" && (
                        <div className={styles.updateForm}>
                            <h4>Add a new update</h4>
                            <input type="text" placeholder="Update Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
                            
                            <select value={updateCategory} onChange={(e) => setUpdateCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                <option value="Gameplay & Feature Updates">Gameplay & Feature Updates</option>
                                <option value="Art & Design Showcase">Art & Design Showcase</option>
                                <option value="Audio & Soundtrack Updates">Audio & Soundtrack Updates</option>
                                <option value="Technical & Development Insights">Technical & Development Insights</option>
                                <option value="Playtesting & Feedback">Playtesting & Feedback</option>
                            </select>

                            <textarea placeholder="General Progress Update" value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} />
                            <textarea placeholder="Roadmap & Schedule Adjustments" value={roadmapUpdate} onChange={(e) => setRoadmapUpdate(e.target.value)} />
                            <textarea placeholder="Community Engagement & Events" value={communityEngagement} onChange={(e) => setCommunityEngagement(e.target.value)} />
                            <textarea placeholder="Thank You & Closing Notes" value={closingNotes} onChange={(e) => setClosingNotes(e.target.value)} />

                            <button onClick={handleSubmitUpdate}>Submit Update</button>
                        </div>
                    )}

                    {/* Affichage des updates */}
                    <h4>Update History</h4>
                    <ul>
                        {stages.map((stage, index) => (
                            <li key={index}>
                                <strong>{stage.title} ({stage.category})</strong>
                                <p>{stage.content}</p>
                                <p><strong>Roadmap Update:</strong> {stage.roadmapUpdate}</p>
                                <p><strong>Community Engagement:</strong> {stage.communityEngagement}</p>
                                <p><strong>Closing Notes:</strong> {stage.closingNotes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default ProjectValidated;
