import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import { loadTweets } from '../reducers/tweets';
import { useRouter } from 'next/router';
import styles from '../styles/Hashtag.module.css';
import Link from 'next/link';
import Tweet from './Tweet';
import Trends from './Trends';
import Image from 'next/image';
import {loadMessages} from '../reducers/chatMessage';

function Project(props) {

    const [chatMessage, setChatMessage] = useState('');
    const router = useRouter();
    const {project} = router.query;
    const [query, setQuery] = useState('');

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);

    const handlePledge = 0;

    const handleInputChange = (e) => {
        if (chatMessage.length < 120 ) {
            setChatMessage(e.target.value)
        }
    };

    useEffect(() => {
        if (!project) {
            return;
        }
        setQuery(project);
        fetch(`http://localhost:3000/projects/${project}`)
            .then(response => response.json())
                .then(data => {
                    data.result && dispatch(loadMessages(data.chatMessages))
                })

    }, [project])

    const handleChat = () => {
        fetch(`http://localhost:3000/project/${props.name}/messages`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({token: user.token, content: chatMessage}),
        }).then(response => response.json())
            .then(data => {
                if (data.result) {
                    const newMessage = {...data.chatMessages, author: user.userName}
                    dispatch(addChatMessage(newMessage))
                    setChatMessage('');
                }
            })
    };

    const handleNav = 0;

    






    return (
        <>
            <div className={styles.PubContainer}>
                <p>Pub</p>
            </div>
            <div className={styles.CentralContainer}>

            </div>
            <div className={styles.RightContainer}>
                <div className={styles.CreatorPage}>
                    <Image src="" alt="User Avatar" width={46} height={46} className={styles.avatar}/> {/*définir l'url de l'avatar */}
                    <div className={styles.CreatorDescription}>
                        <p>{user.description}</p>
                    </div>
                </div>
                <div className={ChatContainer}>
                    <p>News & Chat</p>
                    <div className={ChatBox}>
                        <div className={MessagesBox}>
                            {messages}
                        </div>
                        <div className={buttonContainer}>
                            <textarea type="text" placeholder="comment and converse" className={styles.input} onChange={(e) => handleInputChange(e)} value={chatMessage}/>

                            <button className={styles.button} onClick={() => handleChat()}>
                            </button >

                        </div>
                    </div>
                </div>

            </div>
        </>

    );
}

export default Project;