import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {loadMessages} from '../reducers/chatMessage';
import styles from '../styles/project.module.css';

function Project(props) {

    const [chatMessage, setChatMessage] = useState('');
    const router = useRouter();
    const {project} = router.query;
    // const [query, setQuery] = useState('');
    const [projectData, setProjectData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState('');
    const [news, setNews] = useState([]);
    const userAccount = useSelector((state) => state.user.value);

    // const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.value);
    console.log(projectData)
    const handlePledge = 0;

    

    useEffect(() => {
        if (!project) {
            return;
        }
        // setQuery(project);
        fetch(`http://localhost:3000/projects/${project}`)
            .then(response => response.json())
                .then(data => {
                    data.result && setProjectData(data.project)
                    setIsLoading(false)
                })

    }, [project])


    const handleInputChange = (e) => {
        if (chatMessage.length < 120 || key === "Backspace" ) {
            setChatMessage(e.target.value)
        }
    };

    const handleChat = () => {
        if (chatMessage.length < 1) {
            return;
        }

        fetch(`http://localhost:3000/projects/messages/${project}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({token: userAccount.token, message: chatMessage}),
        }).then(response => response.json())
            .then(data => {
                    setChatMessage('');
                    setNews([...news, data.updatedMessage])
            })
    };

    // const handleNav = 0;

  if (isLoading) {
    return <div>Loading...</div>
  }

    const favorited = projectData.user.followedProjects.map((data, i) => {
            return (
                <p key={i}>{data}</p>
            )
        })
    
    

    const funded = projectData.user.fundedProjects.map((data, i) => {
            return (
                <p key={i}>{data}</p>
            )
        })
    
    

    const pledgesToShow = projectData.detail.pledges.map((data, i) => {
        let tier;
    switch(data.contributionLevel) {
        case 15:
            tier = "Bronze Supporter Tier"
            break;
        case 30:
            tier = "Silver Supporter Tier"
            break;
        case 50:
            tier = "Gold Contributor Tier"
            break;
        case 75:
            tier = "Platinum Patron Tier"
            break;
        case 100:
            tier = "Elite Patron Tier"
            break;
        case 150:
            tier = "Legendary Patron Tier"
            break;
        case 200:
            tier = "Ultimate Patron Tier"
            break;
        default:
          tier = "Supporter Pack Tier"
      }

        const rewardsToShow = data.rewards.map((rew, j) => {
            return (
                <p key={j}>{rew}</p>
            )
        })

        return (
            <div key={i} className={styles.pledgeBox}>
                <div className={styles.pledgeTitle}>
                    <p>${data.contributionLevel} - {tier}</p>
                </div>
                <div className={styles.pledgeDescContainer}>
                    {rewardsToShow}
                </div>
            </div>     
        )
    })



    const intStudios = projectData.studiosPreVote.map((data, i) => {
        return (
            <div className={styles.studioBox}>
                {/* <h6>{data.studio.companyName}</h6>    il va falloir mettre les mains dans la collection user/studio            */}
                {/* <p> infos à mettre sur le lien entre le studio et ce projet </p> */}
            </div>
        )
    })

    const genres = projectData.detail.gameMechanics.map((data, i) => {
        return (
            <p key={i}>{data.name}</p>
        )
    })

    const messages = projectData.histories.map((data, i) => {
        return (
            <div key={i} className={styles.messageContainer}>
                <p className={styles.userposting}>{data.userPosting.username} - {data.userPosting.role}</p>
                <p className={styles.message}>{data.message}</p>
                <p className={styles.messageDate}>{data.date}</p>
            </div>
        )
    })
    
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
                        <image/>
                        <div className={styles.creatorInfo}>
                            <div className={styles.usernameContainer}>
                                <p className={styles.creatorInfoTitle}>Username</p>
                                <p>{projectData.user.username}</p>
                            </div>
                            <div className={styles.favorites}>
                                <p className={styles.creatorInfoTitle}>Favorited Games</p>
                                {favorited}
                            </div>
                            <div className={styles.funded}>
                                <p className={styles.creatorInfoTitle}>Funded Games</p>
                                {funded}
                            </div> 
                        </div>
                    </div>
                    <div className={styles.creatorBottom}>
                        <div className={styles.creatorDescriptionContainer}>
                            {/* <p>{project.user.description}</p> */}
                        </div>
                    </div>
                </div>
                <div className={styles.pledgeContainer}>
                    <image/>
                    <div className={styles.pledgeUpContainer}>
                        <h3>PLEDGES</h3>
                    </div>
                    <div className={styles.pledgesContainer}>
                        {pledgesToShow}
                    </div>
                </div>
            </div>

{/* CENTRAL BAR */}
            <div className={styles.centralBar}>
                <div className={styles.pitchContainer}>
                    <h3>{projectData.pitch}</h3>
                </div>
                <div className={styles.progressContainer}>

                </div>
                <div className={styles.studiosContainer}>
                    <image/>
                    <div className={styles.InterestedStudios}>
                        <h4>Interested Studios</h4>
                        <div className={styles.studioBoxesContainer}>
                            {intStudios}
                        </div>    
                    </div>
                </div>
                <div className={styles.characContainer}>
                    <div className={styles.characTitleBox}>
                        <h3 className={styles.characTitle}>Characteristics</h3>
                    </div>
                    <div className={styles.characContentContainer}>
                        <div className={styles.DescContainer}>
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
                                        {genres}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Story & Narrative</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {genres}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>World Design</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {genres}
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.characRightBox}>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Universe & Ambiance</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {genres}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Game Modes</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {genres}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Entities Behavior</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {genres}
                                    </div>
                                </div>
                                <div className={styles.genreContainer}>
                                    <div className={styles.characTitleContainer}>
                                        <h6>Progressions & Rewards</h6>
                                    </div>
                                    <div className={styles.characIterationContainer}>
                                        {genres}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.downloadButton}>
                        <button>Download</button>
                    </div>
                </div>
                <div className={styles.buttonBox}>
                    <button>Take on the adventure</button>
                    {/* <button>Develop this Project</button>  if user.role = studio sinon l'autre bouton*/}
                </div>
            </div>

{/* RIGHT BAR */}
            <div className={styles.rightBar}>
                <div className={styles.NewschatContainer}>
                    <h5>News & Chat</h5>
                    <div className={styles.NewsChatBox}>
                        {messages}
                    </div>
                    <div className={styles.chattingBox}>
                        <input placeholder='chat here' className={styles.messageInput} onChange={(e) => handleInputChange(e)} value={chatMessage} onKeyDown={(e) => setKey(e.key)}></input>
                        <button className={styles.send} onClick={() => handleChat()}>Send</button>
                    </div>

                </div>
            </div>
        </div> 
        </>
    )}

export default Project;