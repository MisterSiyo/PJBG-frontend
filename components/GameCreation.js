import styles from '../styles/GameCreation.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function GameCreation() {

    const router = useRouter();
    const [title, setTitle] = useState('');
    const [pitch, setPitch] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState('');
    const [key, setKey] = useState('');
    const [gameMechanics, setGameMechanics] = useState([]);
    const [pledges, setPledges] = useState([]);
    const [selectedPledges, setSelectedPledges] = useState([]);
    const [selectedGameMechanics, setSelectedGameMechanics] = useState([]);
    const [hoveredGMIndex, setHoveredGMIndex] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

    const user = useSelector((state) => state.user.value);
    console.log(selectedGameMechanics, selectedPledges)
    useEffect(() => {
         console.log('useEffect')
        fetch('http://localhost:3000/characteristics').then(response => response.json()).then(data => {
            console.log('apres fetch')
            if (!data.result) {
                console.log('not result')
                return;
            }
        console.log('result but before setters')
        setGameMechanics(data.gameMechanics);
        setPledges(data.pledges);
        console.log(data)
         })
     },[])


     const handleClickPledge = (pledge) => {
        setSelectedPledges((current) => current.filter(e => e.contributionLevel !== pledge.contributionLevel));
        setSelectedPledges((current) => [...current, pledge]);
     }

     const handleClickGM = (GM) => {
        setSelectedGameMechanics((current) => {
            if (current.includes(GM)) {
                return current.filter(item => item !== GM);
            }
            return [...current, GM];
        });
    };
    
const pledgesBoxes = pledges.map((data, i) => {
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
    const rewards = data.rewards.map((reward, j) => {
        return (
            <p key={j}>{reward}</p>
        )
    });

    return (
        <div className={`${styles.pledgeBox} ${selectedPledges.includes(data) ? styles.selected : ''}`}
         data-title={tier} key={i} onClick={() => handleClickPledge(data)}>
            <p>{data.contributionLevel} €</p>
            
            {rewards}
        </div>
    )
})


const GMboxesByType = () => {
    const groupedMechanics = gameMechanics.reduce((acc, gm) => {
        if (!acc[gm.GMType]) {
            acc[gm.GMType] = [];
        }
        acc[gm.GMType].push(gm);
        return acc;
    }, {});

    return Object.entries(groupedMechanics).map(([type, mechanics], typeIndex) => (
        <div key={typeIndex} className={styles.gmTypeSection}>
            <h3 className={styles.gmTypeTitle}>{type}</h3>
            <div className={styles.gmTypeContainer}>
                {mechanics.map((data, i) => (
                    <div 
                        className={`${styles.gameMechanicBox} ${selectedGameMechanics.includes(data) ? styles.selected : ''}`}
                        key={i}
                        onMouseEnter={() => setHoveredGMIndex(`${type}-${i}`)}
                        onMouseLeave={() => setHoveredGMIndex(null)}
                        onClick={() => handleClickGM(data)}
                        style={{position: 'relative'}}
                    >
                        <p>{data.name}</p>
                        {hoveredGMIndex === `${type}-${i}` && 
                            <div className={styles.popover}>
                                <p>{data.description}</p>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    ));
};

    const handleTitleChange = (e) => {
        if (title.length < 30 || key === 'Backspace' ) {
            setTitle(e.target.value);
        }
    }

    const handlePitchChange = (e) => {
        if (pitch.length < 100 || key === 'Backspace' ) {
            setPitch(e.target.value);
        }
    }

    const handleDescriptionChange = (e) => {
        if (description.length < 10000 || key === 'Backspace' ) {
            setDescription(e.target.value);
        }
    }

    const handleGoalChange = (e) => {
        if (!/[0-9]/.test(key) && key !== 'Backspace') {
            return;
        }
        if (goal.length < 7 || key === 'Backspace' ) { // max à 10 million exclu
            setGoal(e.target.value);
        }
    }

    const handleSubmit = () => {

        if (!user.token){
            return;
        }

        let pledgesID = selectedPledges.map((data) => {
            return data._id
        })

        let GMID = selectedGameMechanics.map((data) => {
            return data._id
        })
        

        fetch('http://localhost:3000/projects/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: user.token, title, pitch, description, goal, pledges: pledgesID, gameMechanics: GMID }),
        }).then(response => response.json())
            .then(data => {
                if (data.result) {
                    // lui dire que tout est ok
                    router.push(`/project/${data.newCreatedProject.pageURL}`)
                }
            })
    }

    // la partie dure : mapper sur le tableau gameMecahnics, puis, à chaque itération,
    // créer un regex à partir du string obtenu, plus rajouter quelques déclinaisons algorythmiques 
    // basées sur les affixes et suffixes du mot pour être sur de la capter, 
    // et éventuellement sur les doubles consommes manquantes si j'ai envie de m'amuser
    // ensuite, le tester sur tout le string de la description. Si un match apparait, ajouter le matching
    // (côté tableau) au selectedGM,


    // la partie pas dure mais chiante : faire que lorsqu'un GM ou pledge apparait dans les
    // variables d'état 'selected', qu'il apparaisse en bleu pour le user (pour qu'il voit ce qu'il a select)
    // et le truc cool avec le regex, c'est que ça le mettrait direct en bleu sans que le user n'ait à le faire
    // pb à prévoir : s'il veut le déselectionner, faut lui prévoir le droit de forcer la sortie
    // sans que le re-render le rechoppe. donc là j'avoue je sais pas encore, mais j'y réfléchis.




    return (
    <>
        <div className={styles.container}>
            <h2 className={styles.header}>You have a videogame idea, great ! Can you please describe it to everybody ?</h2>
            <div className={styles.inputsContainer}>
                <input className={styles.inputField1} type='text' placeholder='title of your game (max 30 char)' onChange={(e) => handleTitleChange(e)} value={title} onKeyDown={(e) => setKey(e.key)}></input>
                <input className={styles.inputField2} type='text' placeholder='a quick summary of your game (max 100 char)' onChange={(e) => handlePitchChange(e)} value={pitch} onKeyDown={(e) => setKey(e.key)}></input>
                <textarea 
                    className={styles.inputField3} 
                    placeholder='a description of your game (max 10,000 char)' 
                    onChange={(e) => handleDescriptionChange(e)} 
                    value={description} 
                    onKeyDown={(e) => setKey(e.key)}
                    ></textarea>
                <input className={styles.inputField4} type='text' placeholder='How much should it cost ? (optional)' onChange={(e) => handleGoalChange(e)} value={goal} onKeyDown={(e) => setKey(e.key)}></input>
            </div>
            <div className={styles.pledgesSection}>
                <h2 className={styles.pledgesSectionTitle}>What pledges do you want to see in your projet ? only one option per tier</h2>
                <div className={styles.pledgesContainer}>
                    {pledgesBoxes}
                </div>
            </div>
            <div className={styles.gameMechanicsSection}>
                <h2 className={styles.gameMechanicsSectionTitle}>What game mechanics do you think characterize your idea ?</h2>
                <div className={styles.gameMechanicsContainer}>
                    {GMboxesByType()}
                </div>
            </div>
            
            <button className={styles.button} onClick={() => handleSubmit()}>Press F</button>
        </div>   
    </>
    )
}