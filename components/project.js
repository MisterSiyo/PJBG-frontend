import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";
import { useRouter } from "next/router";
import Link from "next/link";
import { loadMessages } from "../reducers/chatMessage";
import styles from "../styles/project.module.css";
import ProjectValidated from "./projectValidated";

function Project(props) {

    const [chatMessage, setChatMessage] = useState('');
    const router = useRouter();
    const {project} = router.query;
    // const [query, setQuery] = useState('');
    const [projectData, setProjectData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState('');
    const userAccount = useSelector((state) => state.user.value);
    const [news, setNews] = useState([]);
    const user = useSelector((state) => state.user.value)
    const [dlmessage, setDlmessage] = useState('');
    const [devMessage, setDevMessage] = useState('');
    const [voteMessage, setVoteMessage] = useState('');
    const [votedStudioId, setVotedStudioId] = useState(null);
    // const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.value);


  useEffect(() => {
    if (!project) {
      return;
    }

    fetch(`http://localhost:3000/projects/${project}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setProjectData(data.project);
          setNews(data.project.histories);
          setIsLoading(false);

              // Vérifier si l'utilisateur a déjà voté pour un studio
          if (data.project.votes && data.project.votes[user._id]) {
            setVotedStudioId(data.project.votes[user._id]);
          }

          const validatedByStaff = data.project.isValidatedByStaff;
          const studioPreVote = data.project.studiosPreVote;
          const hasFunded = data.project.user.fundedProjects.some(
            (project) => project.projectId === data.project._id
          );

          if (
            validatedByStaff &&
            hasFunded &&
            studioPreVote.some((studio) => studio.studioId === user.studioId)
          ) {
            setProjectData((prev) => ({ ...prev, layoutType: "validated" }));
          }

          data.project.user.fundedProjects.forEach((project, index) => {
            console.log(`Project ${index}:`, project);
            console.log("Project ID:", project.projectId);
            console.log("Type:", typeof project.projectId);
            console.log("Match:", project.projectId === data.project._id);
          });
        }
      });
  }, [project]);

  // ajout de la page validated

  if (isLoading) return <div>loading...</div>;
  if (!projectData) return <div>Project Not Found</div>;

  if (projectData.layoutType === "validated") {
    return <ProjectValidated projectData={projectData} />;
  }

  const handleInputChange = (e) => {
    if (chatMessage.length < 120 || key === "Backspace") {
      setChatMessage(e.target.value);
    }
  };

  const handleChat = () => {
    if (chatMessage.length < 1) {
      return;
    }

    fetch(`http://localhost:3000/projects/messages/${project}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userAccount.token, message: chatMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNews([...news, data.updatedMessage]);
        setChatMessage("");
      });
  };

  // const handleNav = 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const favorited = projectData.user.followedProjects.map((data, i) => {
    return (
      <p className={styles.favoriteText} key={i}>
        {data.title}
      </p>
    );
  });

  const funded = projectData.user.fundedProjects.map((data, i) => {
    return (
      <p className={styles.fundedText} key={i}>
        {data.project.title}
      </p>
    );
  });

  const pledgesToShow = projectData.detail.pledges
    .sort((a, b) => a.pledgeId - b.pledgeId)
    .map((data, i) => {
      let tier;
      switch (data.contributionLevel) {
        case 15:
          tier = "Bronze Supporter Tier";
          break;
        case 30:
          tier = "Silver Supporter Tier";
          break;
        case 50:
          tier = "Gold Contributor Tier";
          break;
        case 75:
          tier = "Platinum Patron Tier";
          break;
        case 100:
          tier = "Elite Patron Tier";
          break;
        case 150:
          tier = "Legendary Patron Tier";
          break;
        case 200:
          tier = "Ultimate Patron Tier";
          break;
        default:
          tier = "Supporter Pack Tier";
      }

      const rewardsToShow = data.rewards.map((rew, j) => {
        return (
          <p className={styles.rewardText} key={j}>
            {rew}
          </p>
        );
      });

        return (
            <div key={i} className={styles.pledgeBox} onClick={() => handlePledge(data.pledgeId, data.contributionLevel)}>
                <div className={styles.pledgeTitle}>
                    <p className={styles.contributionLevelText} >${data.contributionLevel} - {tier}</p>
                </div>
                <div className={styles.pledgeDescContainer}>
                    {rewardsToShow}
                </div>
            </div>     
        )
    })


    const handleVote = (studioId) => {
        // Vérifier si l'utilisateur est le créateur ou un financeur du projet
        const isCreator = projectData.user._id === user._id;
        const isFunder = projectData.progressions && 
        projectData.progressions.some(p => p.userFunding && p.userFunding._id === user._id);
        
        if (!isCreator && !isFunder) {
            setVoteMessage("You can only vote if you created or funded this project");
            return;
        }
    
        // Si l'utilisateur clique sur le même studio pour lequel il a déjà voté, changer le vote
        const newStudioId = votedStudioId === studioId ? null : studioId;
        
        fetch('http://localhost:3000/projects/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: user.token,
                projectId: projectData._id,
                studioId: newStudioId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setVoteMessage(data.message);
                setVotedStudioId(newStudioId);
                
                // Recharger les données du projet pour refléter le vote
                fetch(`http://localhost:3000/projects/${project}`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.result) {
                            setProjectData(data.project);
                            // Mettre à jour la liste des messages
                            setNews(data.project.histories);
                        }
                    });
            } else {
                setVoteMessage(data.message || 'An error occurred while voting.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setVoteMessage('A connection error has occurred');
        });
    };
    
    
    console.log('voici le truc putain : ', projectData.studiosPreVote)

    const intStudios = projectData.studiosPreVote.map((data, i) => {
        const studioCompanyName = data.studio && data.studio.studio ? data.studio.studio.companyName : 'Unknown Studio';
        const studioDescription = data.studio && data.studio.studio ? data.studio.studio.description : 'No description available';
        const isVoted = votedStudioId === data.studio._id;
        
        return (
            <div key={i} className={`${styles.studioBox} ${isVoted ? styles.votedStudio : ''}`}>
                <h6>{studioCompanyName}</h6> 
                <p>{studioDescription}</p>
                {user.role === 'patron' && (
                    <button 
                        className={`${styles.voteButton} ${isVoted ? styles.votedButton : ''}`}
                        onClick={() => handleVote(data.studio._id)}
                    >
                        {isVoted ? 'Voted' : 'Vote for this studio'}
                    </button>
                )}
            </div>
        )
    });
    

  const genres = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "genre") {
      return;
    }
    return (
      <p
        key={i}
        className={styles.categoryTag}
        style={{
          background:
            data.color2 === "#"
              ? data.color
              : `linear-gradient(45deg, ${data.color} 0%, ${data.color} 15%, ${data.color2} 85%, ${data.color2} 100%)`,
          transition: "background 0.3s ease",
        }}
      >
        {data.name}
      </p>
    );
  });

  const gameplays = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "gameplay") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const storytellings = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "storytelling") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const universes = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "universe") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const gamemodes = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "gamemode") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const rewardsystem = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "rewardsystem") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const difficulties = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "difficulty") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const npctypes = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "npctype") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const tropes = projectData.detail.gameMechanics.map((data, i) => {
    if (data.GMType !== "tropes") {
      return;
    }
    return (
      <p className={styles.gmText} key={i}>
        {data.name}
      </p>
    );
  });

  const messages = news.map((data, i) => {
    return (
      <div key={i} className={styles.messageContainer}>
        <p className={styles.userposting}>
          {data.userPosting.username} - {data.userPosting.role}
        </p>
        <p className={styles.message}>{data.message}</p>
        <p className={styles.messageDate}>{data.date}</p>
      </div>
    );
  });

  const handlePledge = (pid, pcl) => {
    router.push({
      pathname: "/checkoutPayment",
      query: { pid, pcl, gid: projectData._id, title: projectData.title },
    });
    // router.push('/checkoutPayment')
  };

  const handleDev = () => {
    fetch("http://localhost:3000/projects/dev", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token, projectId: projectData._id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setDevMessage("Project added to your chosen projects");
        }
      });
  };

  const totalCollected = (
    projectData.progressions?.reduce(
      (acc, p) => acc + (p.pledgeChosen.contributionLevel || 0),
      0
    ) || 0
  ).toLocaleString();
  const goal = projectData.goal?.toLocaleString();
  const fundingPercentage = projectData.goal
    ? Math.round((totalCollected / projectData.goal) * 100)
    : 0;

  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{projectData.title}</h2>
      </div>
      <div className={styles.pageContent}>
        {/* LEFT BAR */}
        <div className={styles.leftBar}>
          <div className={styles.creatorContainer}>
            <div className={styles.creatorUp}>
              <div className={styles.creatorInfo}>
                {/* <image/> */}
                <div className={styles.usernameContainer}>
                  <div className={styles.usernameBG}>
                    <p className={styles.username}>
                      {projectData.user.username}
                    </p>
                  </div>
                </div>
                <div className={styles.favorites}>
                  <div className={styles.favBG}>
                    <p>testFav1</p>
                    <p>testFav2</p>
                    <p>testFav3</p>
                    <p>testFav4</p>
                    {favorited}
                  </div>
                </div>
                <div className={styles.funded}>
                  <div className={styles.fundedBG}>{funded}</div>
                </div>
              </div>
            </div>
            <div className={styles.creatorBottom}>
              <div className={styles.creatorDescriptionContainer}>
                <p>{projectData.user.description}</p>
              </div>
            </div>
          </div>
          <div className={styles.pledgeContainer}>
            <image />
            <div className={styles.pledgeUpContainer}>
              <h3>PLEDGES</h3>
            </div>
            <div className={styles.pledgesContainer}>{pledgesToShow}</div>
          </div>
        </div>

{/* CENTRAL BAR */}
            <div className={styles.centralBar}>
                <div className={styles.pitchContainer}>
                    <h3>{projectData.pitch}</h3>
                </div>
                <div className={styles.progressContainer}>
                    <span className={styles.progressText}>
                        {fundingPercentage}% | {totalCollected}€ / {goal}€
                    </span>
                    <div className={styles.progressBar} style={{ width: `${fundingPercentage}%` }}> 
                    </div>
                </div>
                <div className={styles.studiosContainer}>
                    <image/>
                    <div className={styles.InterestedStudios}>
                        <h4>Interested Studios</h4>
                        {user.role === 'patron' && (
                         <>
                            {votedStudioId ? (
                                 <p className={styles.voteStatus}>  You have voted for: {
                                    projectData.studiosPreVote.find(s => s.studio._id === votedStudioId)?.studio?.studio?.companyName || 'Unknown Studio'
                                }</p>
                            ) : projectData.studiosPreVote.length > 1 ? (
                                <p className={styles.voteInstruction}>Vote for one Studio</p>
                            ) : null}
                        </>
                    )}
                    <div className={styles.studioBoxesContainer}>
                        {intStudios}
                    </div>
                    {voteMessage && <p className={styles.voteMessage}>{voteMessage}</p>}
                    </div>
                </div>
                <div className={styles.characContainer}>
                    <div className={styles.characTitleBox}>
                        <h3 className={styles.characTitle}>Characteristics</h3>
                    </div>
                    <div className={styles.characContentContainer}>
                        <div className={styles.descContainer}>
                            <p>{projectData.detail.description}</p>
                        </div>
                        <div className={styles.otherCharac}>
                            <div className={styles.characLeftBox}>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Game Genre</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {genres}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Gameplay & Mechanics</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {gameplays}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Story & Narrative</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {storytellings}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Difficulty Modes</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {difficulties}
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.characRightBox}>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Universe & Ambiance</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {universes}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Game Modes</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {gamemodes}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>NPC Behavior</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {npctypes}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Progressions & Reward System</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {rewardsystem}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Tropes</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {tropes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {user.role === 'studio' && <>
                            <div className={styles.downloadButton} onClick={() => setDlmessage('Project Downloaded!')}>
                                    Download all information on this project
                            </div>
                            <p>{dlmessage}</p>
                    
                    </>}
                </div>
                    {user.role == "studio" && <div className={styles.takeon} onClick={handleDev}>Take on the adventure and Develop this project</div>}
                    <p>{devMessage}</p>
            </div>

        {/* RIGHT BAR */}
        <div className={styles.rightBar}>
          <div className={styles.NewschatContainer}>
            <h5>News & Chat</h5>
            <div className={styles.NewsChatBox}>{messages}</div>
            <div className={styles.chattingBox}>
              <input
                placeholder="chat here"
                className={styles.messageInput}
                onChange={(e) => handleInputChange(e)}
                value={chatMessage}
                onKeyDown={(e) => setKey(e.key)}
              ></input>
              <div className={styles.send} onClick={() => handleChat()}>
                Send
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
