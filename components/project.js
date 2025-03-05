import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {loadMessages} from '../reducers/chatMessage';
import styles from '../styles/project.module.css';

function Project(props) {

    // const [chatMessage, setChatMessage] = useState('');
    const router = useRouter();
    const {project} = router.query;
    // const [query, setQuery] = useState('');
    const [ProjectData, setProjectData] = useState({});

    // const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.value);

    const handlePledge = 0;

    // const handleInputChange = (e) => {
    //     if (chatMessage.length < 120 ) {
    //         setChatMessage(e.target.value)
    //     }
    // };

    useEffect(() => {
        if (!project) {
            return;
        }
        // setQuery(project);
        fetch(`http://localhost:3000/projects/${project}`)
            .then(response => response.json())
                .then(data => {
                    data.result && setProjectData(data.project)
                })

    }, [project])

    // const handleChat = () => {
    //     fetch(`http://localhost:3000/project/${props.name}/messages`, {
    //         method: 'POST',
    //         headers: {'Content-Type' : 'application/json'},
    //         body: JSON.stringify({token: user.token, content: chatMessage}),
    //     }).then(response => response.json())
    //         .then(data => {
    //             if (data.result) {
    //                 const newMessage = {...data.chatMessages, author: user.userName}
    //                 dispatch(addChatMessage(newMessage))
    //                 setChatMessage('');
    //             }
    //         })
    // };

    // const handleNav = 0;

    
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
            <h2 className={styles.title}>{project}</h2>
        </div>
        <div className={styles.pageContent}>
            <div className={styles.leftBar}>
                <div className={styles.creatorContainer}>
                    <div className={styles.creatorUp}>

                    </div>
                    <div className={styles.creatorBottom}>
                        <div className={styles.creatorDescriptionContainer}>
                            {/* <p>{project.user.description}</p> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.centralBar}>
                <div className={styles.progressContainer}>

                </div>
                <div className={styles.studiosContainer}>

                </div>
                <div className='characBox'>
                    <div className='characTitle'>

                    </div>
                    <div className='characContentDiv'>
                        <div className='leftCharacBox'>

                        </div>
                        <div className='rightCharacBox'>

                        </div>
                    </div>
                    <div className='buttonDownload'>

                    </div>
                </div>
            </div>
            <div className='rightBar'>
    
            </div>
        </div>
        <div className='buttonBox'>
            <button>Take on the adventure</button>
        </div>
        
        
            
            <p>{ProjectData.title}</p>
            <p>{ProjectData.pitch}</p>
        </>
    )}



//     return (
//         <>
//             <div className={styles.PubContainer}>
//                 <p>Pub</p>
//             </div>
//             <div className={styles.CentralContainer}>

//             </div>
//             <div className={styles.RightContainer}>
//                 <div className={styles.CreatorPage}>
//                     <Image src="" alt="User Avatar" width={46} height={46} className={styles.avatar}/> {/*définir l'url de l'avatar */}
//                     <div className={styles.CreatorDescription}>
//                         <p>{user.description}</p>
//                     </div>
//                 </div>
//                 <div className={ChatContainer}>
//                     <p>News & Chat</p>
//                     <div className={ChatBox}>
//                         <div className={MessagesBox}>
//                             {messages}
//                         </div>
//                         <div className={buttonContainer}>
//                             <textarea type="text" placeholder="comment and converse" className={styles.input} onChange={(e) => handleInputChange(e)} value={chatMessage}/>

//                             <button className={styles.button} onClick={() => handleChat()}>
//                             </button >

//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </>

//     );
// }

export default Project;