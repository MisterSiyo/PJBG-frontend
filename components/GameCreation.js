import styles from '../styles/layout.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function GameCreation() {

    const router = useRouter();
    const [title, setTitle] = useState('');
    const [pitch, setPitch] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState('0');
    const [key, setKey] = useState('');

    const user = useSelector((state) => state.user.value)


    // useEffect(() => {
    //     fetch()
    // }, [])    attraper la route qui sert les gameMechanics et les pledges 








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
        if (description.length < 1000 || key === 'Backspace' ) {
            setDescription(e.target.value);
        }
    }

    const handleGoalChange = (e) => {
        if (!/[0-9]/.test(key)) {
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

        fetch('http://localhost:3000/projects/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: user.token, title, pitch, description, goal}),
        }).then(response => response.json())
            .then(data => {
                if (data.result) {
                    // lui dire que tout est ok
                    router.push(`/project/${data.newCreatedProject.pageURL}`)
                }
            })
    }

    return (
        <>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
            <h2>You have a videogame idea, great ! Use the inputs below to describe it</h2>

            <input type='text' placeholder='title of your game (max 30 char)' onChange={(e) => handleTitleChange(e)} value={title} onKeyDown={(e) => setKey(e.key)}></input>
            <input type='text' placeholder='a quick summary of your game (max 100 char)' onChange={(e) => handlePitchChange(e)} value={pitch} onKeyDown={(e) => setKey(e.key)}></input>
            <input type='text' placeholder='a description of your game (max 1,000 char)' onChange={(e) => handleDescriptionChange(e)} value={description} onKeyDown={(e) => setKey(e.key)}></input>
            <input type='text' placeholder='How much should it cost ? (optionnal)' onChange={(e) => handleGoalChange(e)} value={goal} onKeyDown={(e) => setKey(e.key)}></input>
            <button onClick={() => handleSubmit()}>Press F</button>
        </>
    )
}