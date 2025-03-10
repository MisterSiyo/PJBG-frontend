import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from '../styles/projectValidated.module.css';

function ProjectValidated() {
  // État pour le chat
  const [chatMessage, setChatMessage] = useState('');
  const [news, setNews] = useState([]);

  // État pour le projet
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Champs du nouveau Update
  const [title, setTitle] = useState('');
  const [generalProgress, setGeneralProgress] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [closingNotes, setClosingNotes] = useState('');

  // Catégorie sélectionnée et son contenu
  const [updateCategory, setUpdateCategory] = useState('');
  const [updateCategoryContent, setUpdateCategoryContent] = useState('');
  const [extraCategories, setExtraCategories] = useState([]);

  // Tableau qui stocke toutes les updates (stages)
  const [stages, setStages] = useState([]);

  // Router + user depuis Redux
  const router = useRouter();
  const { project } = router.query;
  const userAccount = useSelector((state) => state.user.value);

  // Récupérer les données du projet
  useEffect(() => {
    if (!project) return;

    fetch(`http://localhost:3000/projects/${project}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setProjectData(data.project);
          setStages(data.project.stages || []);
          setNews(data.project.histories || []);
        }
        setIsLoading(false);
      });
  }, [project]);

  // Gestion de l’envoi d’un message (chat)
  const handleChat = () => {
    if (!chatMessage.trim()) return;

    fetch(`http://localhost:3000/projects/messages/${project}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: userAccount.token, message: chatMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setNews([...news, data.updatedMessage]);
          setChatMessage('');
        }
      });
  };

  // ajouté un nouveau bloc "catégorie update"
  const handleAddCategory = () => {
    setExtraCategories([
        ...extraCategories,
        { category: '', content: ''},
    ]);
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...extraCategories];
    updated[index][field] = value;
    setExtraCategories(updated);
  }

  // Lorsque l’utilisateur soumet la nouvelle update
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    // Au moins un champ doit être rempli
    if (
      !title.trim() &&
      !generalProgress.trim() &&
      !updateCategory &&
      extraCategories.every((cat) => !cat.category && !cat.content.trim()) &&
      !roadmap.trim() &&
      !closingNotes.trim()
    ) {
      alert('Please fill at least one field');
      return;
    }

    // // On construit la "category" pour l'API
    // let finalCategory = 'General'; // par défaut
    // if (updateCategory) {
    //   finalCategory = updateCategory; 
    // }

    // // On combine tout dans un payload
    // const payload = {
    //   title,
    //   category: 'Multi-Category',
    //   content: generalProgress,
    //   roadmapUpdate: roadmap,
    //   closingNotes,
    //   token: userAccount.token,
    // };

//     const categoriesText = extraCategories.map((cat, i) => `## ${cat.category || 'Unknown Category'}\n${cat.content || ''}`).join('\n\n');
//  payload.content += `\n\n${categoriesText}`;

const payload = {title, monthUpdate: generalProgress, update: extraCategories, roadmapUpdate: roadmap, closingNotes: closingNotes}



    // On envoie au backend
    const response = await fetch(
      `http://localhost:3000/projects/update/${projectData._id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      // On ajoute dans stages localement
      const monthYear = new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
      });

      setStages([
        ...stages,
        {
          monthYear,
          title,
          generalProgress,
          updateCategory,
          updateCategoryContent,
          extraCategories,
          roadmap,
          closingNotes,
        },
      ]);

      // Reset des champs
      setTitle('');
      setGeneralProgress('');
      setUpdateCategory('');
      setUpdateCategoryContent('');
      setExtraCategories([]);
      setRoadmap('');
      setClosingNotes('');
    } else {
      alert('Error posting update');
    }
  };

  // Si loading
  if (isLoading) return <div>Loading...</div>;
  if (!projectData) return <div>Project not found</div>;

  // ***********************
  // ** AFFICHAGE PRINCIPAL
  // ***********************
  return (
    <>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{projectData.title}</h2>
      </div>

      <div className={styles.pageContent}>
        {/* Barre de gauche : profil créateur & studio */}
        <div className={styles.leftBar}>
          <div className={styles.creatorContainer}>
            <div className={styles.creatorUp}>
              <div className={styles.creatorInfo}>
                {/* Nom user */}
                <div className={styles.usernameContainer}>
                  <div className={styles.usernameBG}>
                    <p className={styles.username}>
                      {projectData.user?.username || 'Unknown'}
                    </p>
                  </div>
                </div>
                {/* Favorites */}
                <div className={styles.favorites}>
                  <div className={styles.favBG}>
                    <h5>Favorites</h5>
                    {projectData.user.followedProjects?.length > 0 ? (
                      projectData.user.followedProjects.map((f, i) => (
                        <p key={i} className={styles.favoriteText}>
                          {f.project.title}
                        </p>
                      ))
                    ) : (
                      <p>No favorites</p>
                    )}
                  </div>
                </div>
                {/* Funded */}
                <div className={styles.funded}>
                  <div className={styles.fundedBG}>
                    <h5>Funded Projects</h5>
                    {projectData.user.fundedProjects?.length > 0 ? (
                      projectData.user.fundedProjects.map((fd, i) => (
                        <p key={i} className={styles.fundedText}>
                          {fd.project.title}
                        </p>
                      ))
                    ) : (
                      <p>No funded projects</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.creatorBottom}>
              <div className={styles.creatorDescriptionContainer}>
                <h5>Project Creator</h5>
                <p>
                  {projectData.user.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          {/* Studio en charge ? */}
          {projectData.studioValidated && (
            <div className={styles.creatorContainer}>
              <div className={styles.creatorUp}>
                <div className={styles.creatorInfo}>
                  <div className={styles.usernameContainer}>
                    <div className={styles.usernameBG}>
                      <p className={styles.username}>
                        {projectData.studioValidated.studio.companyName ||
                          'Unknown Studio'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.creatorBottom}>
                <div className={styles.creatorDescriptionContainer}>
                  <h5>Studio in Charge</h5>
                  <p>
                    {projectData.studioValidated.studio.description ||
                      'No description'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barre Centrale : Update form + affichage */}
        <div className={styles.centerBar}>
          <h3 className={styles.updatesTitle}>Development Updates</h3>

          {/* Formulaire si user = studio */}
          {userAccount.role === 'studio' && (
            <form onSubmit={handleSubmitUpdate} className={styles.newUpdateForm}>
              {/* TITLE (centré + input en dessous) */}
              <h4 className={styles.formSectionTitle}>Title</h4>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Ex: Milestone 3 Achieved"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* GENERAL PROGRESS */}
              <h4 className={styles.formSectionTitle}>General Progress Update</h4>
              <textarea
                rows={4}
                className={styles.formTextarea}
                placeholder="Briefly describe key tasks, current focus, etc."
                value={generalProgress}
                onChange={(e) => setGeneralProgress(e.target.value)}
              />

              {/* Bouton pour ajouter un bloc Category */}
              <div className={styles.categoryHeader}>
                <h4 className={styles.formSectionTitle}>Select Your Update Category</h4>
                <button
                  type="button"
                  className={styles.addCategoryBtn}
                  onClick={handleAddCategory}
                >
                  Add Another Category
                </button>
              </div>

              {/* Pour chaque bloc "Catégorie" supplémentaire */}
              {extraCategories.map((cat, idx) => (
                <div key={idx} className={styles.categoryBlock}>
                  <select
                    className={styles.formSelect}
                    value={cat.category}
                    onChange={(e) => handleCategoryChange(idx, 'category', e.target.value)}
                  >
                    <option value="">-- No selection --</option>
                    <option value="Gameplay & Feature Updates">Gameplay & Feature Updates</option>
                    <option value="Art & Design Showcase">Art & Design Showcase</option>
                    <option value="Audio & Soundtrack Updates">Audio & Soundtrack Updates</option>
                    <option value="Technical & Development Insights">Technical & Development Insights</option>
                    <option value="Playtesting & Feedback">Playtesting & Feedback</option>
                    <option value="Community Engagement & Events">Community Engagement & Events</option>
                  </select>

                  {/* Zone de texte en dessous */}
                  <textarea
                    rows={3}
                    className={styles.formTextarea}
                    placeholder="Details about this category..."
                    value={cat.content}
                    onChange={(e) => handleCategoryChange(idx, 'content', e.target.value)}
                  />
                </div>
              ))}

              {/* ROADMAP */}
              <h4 className={styles.formSectionTitle}>Roadmap & Schedule Adjustments</h4>
              <textarea
                rows={3}
                className={styles.formTextarea}
                placeholder="Info about upcoming releases, timing changes..."
                value={roadmap}
                onChange={(e) => setRoadmap(e.target.value)}
              />

              {/* THANK YOU / CLOSING */}
              <h4 className={styles.formSectionTitle}>Thank You & Closing Notes</h4>
              <textarea
                rows={3}
                className={styles.formTextarea}
                placeholder="Leave a note for your backers or dev team..."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
              />

              <button type="submit" className={styles.submitBtn}>
                Publish Update
              </button>
            </form>
          )}

          {/* Affichage final de TOUTES les updates (stages) */}
          <div className={styles.updateHistory}>
            <h4>All Updates</h4>
            {stages.length === 0 && <p>No updates yet</p>}
            {stages.map((stg, idx) => (
              <div key={idx} className={styles.updateBox}>
                <div className={styles.updateBoxHeader}>
                  <span className={styles.updateMonthYear}>{stg.monthYear}</span>
                  <img
                    src="/images/twoCats.png"
                    alt="cats"
                    className={styles.catsIcon}
                  />
                </div>
                <div className={styles.updateTitleBar}>
                  {stg.title || 'No Title'}
                </div>
                <div className={styles.updateInnerContent}>
                  <h5 className={styles.subSectionTitle}>General Progress Update</h5>
                  <p>{stg.generalProgress || 'Nothing described'}</p>

                  {/* On affiche chaque bloc de cat */}
                  {stg.extraCategories?.map((c, i2) => (
                    <div key={i2} className={styles.categoryDisplayBlock}>
                      <h5 className={styles.subSectionTitle}>{c.category || 'No category'}</h5>
                      <p>{c.content || 'No details'}</p>
                    </div>
                  ))}

                  {stg.roadmap && (
                    <>
                      <h5 className={styles.subSectionTitle}>Roadmap & Schedule Adjustments</h5>
                      <p>{stg.roadmap}</p>
                    </>
                  )}
                  {stg.closingNotes && (
                    <>
                      <h5 className={styles.subSectionTitle}>Thank You & Closing Notes</h5>
                      <p>{stg.closingNotes}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barre de droite : Chat */}
        <div className={styles.rightBar}>
          <div className={styles.NewschatContainer}>
            <h5>News & Chat</h5>
            <div className={styles.NewsChatBox}>
              {news.map((data, i) => (
                <div key={i} className={styles.messageContainer}>
                  <p className={styles.userPosting}>
                    {data.userPosting.username} - {data.userPosting.role}
                  </p>
                  <p className={styles.message}>{data.message}</p>
                </div>
              ))}
            </div>
            <div className={styles.chattingBox}>
              <input
                placeholder="chat here"
                className={styles.messageInput}
                onChange={(e) => setChatMessage(e.target.value)}
                value={chatMessage}
              />
              <div className={styles.send} onClick={handleChat}>
                Send
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectValidated;
