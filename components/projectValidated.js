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

  // pour étendre le contenu des categories
  const [expandedSections, setExpandedSections] = useState({});

  // Router + user depuis Redux
  const router = useRouter();
  const { project } = router.query;
  const userAccount = useSelector((state) => state.user.value);

  const [toggleUpdate, setToggleUpdate] = useState(false)

  
  // Récupérer les données du projet
  useEffect(() => {
    if (!project) return;
    

    fetch(`https://pjbg-backend.vercel.app/projects/${project}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
         
          setProjectData(data.project);
          setStages(data.project.stages || []);
          setNews(data.project.histories || []);
        }
        setIsLoading(false);
      });
  }, [project, toggleUpdate]);

  

  // Gestion de l’envoi d’un message (chat)
  const handleChat = () => {
    if (!chatMessage.trim()) return;

    fetch(`https://pjbg-backend.vercel.app/projects/messages/${project}`, {
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
    setExtraCategories((curr) => [...curr, { category: '', contentUpdate: ''}]);
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...extraCategories];
    updated[index][field] = value;
    setExtraCategories(updated);
  }
  
  const handleRemoveCategory = (index) => {
    setExtraCategories((current) => current.filter((_, idx) => idx !== index));
  };

  // Lorsque l’utilisateur soumet la nouvelle update
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    // Au moins un champ doit être rempli
    if (
      !title.trim() &&
      !generalProgress.trim() &&
      extraCategories.every((cat) => !cat.category && !cat.contentUpdate.trim()) &&
      !roadmap.trim() &&
      !closingNotes.trim()
    ) {
      alert('Please fill at least one field');
      return;
    }

const payload = {
    title,
    monthUpdate: generalProgress,
    update: extraCategories,
    roadmapUpdate: roadmap,
    closingNotes,
    token: userAccount.token,
    };
   
    // On envoie au backend
    const response = await fetch(
      `https://pjbg-backend.vercel.app/projects/update/${projectData._id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {

      setToggleUpdate(!toggleUpdate)

      // Reset des champs
      setTitle('');
      setGeneralProgress('');
      setExtraCategories([]);
      setRoadmap('');
      setClosingNotes('');
    } else {
      alert('Error posting update');
    }
  };

  const handleToggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
        ...prev,
        [sectionKey]: !prev[sectionKey],
    }));
  };
  
  // Si loading
  if (isLoading) return <div>Loading...</div>;
  if (!projectData) return <div>Project not found</div>;

 // =======================
  //  MAP des gameMechanics
  // =======================
  // J'ai fais que copié ta logique... c'est chaud quand meme. 

  const mechanics = projectData.detail?.gameMechanics || [];

  const genres = mechanics
    .filter((m) => m.GMType === 'genre')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const gameplays = mechanics
    .filter((m) => m.GMType === 'gameplay')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const storytellings = mechanics
    .filter((m) => m.GMType === 'storytelling')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const difficulties = mechanics
    .filter((m) => m.GMType === 'difficulty')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const universes = mechanics
    .filter((m) => m.GMType === 'universe')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const gamemodes = mechanics
    .filter((m) => m.GMType === 'gamemode')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const npctypes = mechanics
    .filter((m) => m.GMType === 'npctype')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const rewardsystem = mechanics
    .filter((m) => m.GMType === 'rewardsystem')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  const tropes = mechanics
    .filter((m) => m.GMType === 'tropes')
    .map((data, i) => <p className={styles.gmText} key={i}>{data.name}</p>);

  // ***********************
  // ** AFFICHAGE PRINCIPAL
  // ***********************
  return (
    <div classname={styles.pageContent}>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        
        <div className={styles.pageContent}></div>
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
                    {projectData.user.followedProjects.length > 0 ? (
                      projectData.user.followedProjects.map((f, i) => (
                        <p key={i} className={styles.favoriteText}>
                          {f.title}
                        </p>
                       
                      )
                    )) : (
                      <p>No favorites</p>
                    )}
                  </div>
                </div>
                {/* Funded */}
                <div className={styles.funded}>
                  <div className={styles.fundedBG}>
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
                <p>
                  {projectData.user.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          {/* Studio en charge ? */}
          {projectData.studioValidated && (
            <div className={styles.studioContainer}>
              <div className={styles.studioUp}>
                <div className={styles.studioInfo}>
                  <div className={styles.studioNameContainer}>
                    <div className={styles.studioNameBG}>
                      <p className={styles.studioName}>
                        {projectData.studioValidated.studio.companyName ||
                          'Unknown Studio'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.studioBottom}>
                <div className={styles.studioDescriptionContainer}>
                  <p>
                    {projectData.studioValidated.studio.description ||
                      'No description'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barre Centrale : Characteristiques + Update form + affichage */}
        <div className={styles.centerBar}>

{/* ============ SECTION CARACTERISTIQUES ============ */}
<div className={styles.characContainer}>
            <div className={styles.characTitleBox}>
              <h3 className={styles.characTitle}>Characteristics</h3>
            </div>

            <div className={styles.characContentContainer}>
              <div className={styles.descContainer}>
                <p>{projectData.detail?.description}</p>
              </div>

              <div className={styles.otherCharac}>
                {/* PARTIE GAUCHE */}
                <div className={styles.characLeftBox}>

                  {/* Game Genre */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Game Genre</h6>
                      <button classname={styles.seemoreBtn}
                        onClick={() => handleToggleSection('genre')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.genre ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.genre && (
                      <div className={styles.characIterationContainer}>
                        {genres}
                      </div>
                    )}
                  </div>

                  {/* Gameplay & Mechanics */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Gameplay & Mechanics</h6>
                      <button
                        onClick={() => handleToggleSection('gameplay')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.gameplay ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.gameplay && (
                      <div className={styles.characIterationContainer}>
                        {gameplays}
                      </div>
                    )}
                  </div>

                  {/* Story & Narrative */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Story & Narrative</h6>
                      <button
                        onClick={() => handleToggleSection('story')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.story ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.story && (
                      <div className={styles.characIterationContainer}>
                        {storytellings}
                      </div>
                    )}
                  </div>

                  {/* Difficulty */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Difficulty Modes</h6>
                      <button
                        onClick={() => handleToggleSection('difficulty')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.difficulty ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.difficulty && (
                      <div className={styles.characIterationContainer}>
                        {difficulties}
                      </div>
                    )}
                  </div>
                </div>

                {/* PARTIE DROITE */}
                <div className={styles.characRightBox}>

                  {/* Universe & Ambiance */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Universe & Ambiance</h6>
                      <button
                        onClick={() => handleToggleSection('universe')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.universe ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.universe && (
                      <div className={styles.characIterationContainer}>
                        {universes}
                      </div>
                    )}
                  </div>

                  {/* Game Modes */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Game Modes</h6>
                      <button
                        onClick={() => handleToggleSection('gamemodes')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.gamemodes ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.gamemodes && (
                      <div className={styles.characIterationContainer}>
                        {gamemodes}
                      </div>
                    )}
                  </div>

                  {/* NPC Behavior */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>NPC Behavior</h6>
                      <button
                        onClick={() => handleToggleSection('npctypes')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.npctypes ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.npctypes && (
                      <div className={styles.characIterationContainer}>
                        {npctypes}
                      </div>
                    )}
                  </div>

                  {/* Progressions & Reward System */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Progressions & Reward System</h6>
                      <button
                        onClick={() => handleToggleSection('rewardsystem')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.rewardsystem ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.rewardsystem && (
                      <div className={styles.characIterationContainer}>
                        {rewardsystem}
                      </div>
                    )}
                  </div>

                  {/* Tropes */}
                  <div className={styles.genreContainer}>
                    <div className={styles.characTitleContainer}>
                      <h6>Tropes</h6>
                      <button
                        onClick={() => handleToggleSection('tropes')}
                        style={{ marginLeft: '10px' }}
                      >
                        {expandedSections.tropes ? 'Hide' : 'See more'}
                      </button>
                    </div>
                    {expandedSections.tropes && (
                      <div className={styles.characIterationContainer}>
                        {tropes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

 {/* ============ Latest News Section ============ */}

 {news.length > 0 && (
            <div className={styles.newsBox}>
              <h3 className={styles.newsTitle}>Latest News</h3>
              <ul className={styles.newsList}>
              {news.filter((newsItem) => newsItem.historyType === "news")
                .map((newsItem, index) => (
                  <li key={index} className={styles.newsItem}>
                    <span className={styles.newsDate}>
                      {new Date(newsItem.date).toLocaleDateString()}
                    </span>
                    <br></br>
                    <span className={styles.newsMessage}>
                       {newsItem.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}


{/* ============ SECTION Updates ============ */}

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
                    value={cat.contentUpdate}
                    onChange={(e) => handleCategoryChange(idx, 'contentUpdate', e.target.value)}
                  />
                  <button className={styles.cancelButton} onClick={() => handleRemoveCategory(idx)}>Cancel</button>
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
                  {/* <img
                    src="/images/twoCats.png"
                    alt="cats"
                    className={styles.catsIcon}
                  /> */}
                </div>
                <div className={styles.updateTitleBar}>
                  {stg.title || 'No Title'}
                </div>
                <div className={styles.updateInnerContent}>
                  <h5 className={styles.subSectionTitle}>General Progress Update</h5>
                  <p>{stg.monthUpdate || 'Nothing described'}</p>

                  {/* On affiche chaque bloc de cat */}
                  {stg.update?.map((c, i2) => (
                    <div key={i2} className={styles.categoryDisplayBlock}>
                      <h5 className={styles.subSectionTitle}>{c.category || 'No category'}</h5>
                      <p>{c.contentUpdate || 'No details'}</p>
                    </div>
                  ))}

                  {stg.roadmapUpdate && (
                    <>
                      <h5 className={styles.subSectionTitle}>Roadmap & Schedule Adjustments</h5>
                      <p>{stg.roadmapUpdate}</p>
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
    </div>
  );
}

export default ProjectValidated;
