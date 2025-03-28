import {useRouter} from 'next/router';
import Head from 'next/head';
// import styles from '../styles/project.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Project from '../../components/project';

// cette page représente chaque page qui sera créée (et chaque URL créée) par un user lorsqu'il crée un projet. On utilise les routes dynamiques pour faire ça.
 function ProjectPage() {

    const router = useRouter();
    const {project} = router.query;
    console.log(project)

    return (
    <>
        <Head>
            <title> a video game project conceived by a gamer</title>
        </Head>
        <Project/>
    </>
    );
}

export default ProjectPage; 
