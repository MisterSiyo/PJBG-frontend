import {useRouter} from 'next/router';
import Head from 'next/head';
import styles from '../styles/project.module.css';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Project from '../../components/project';

// cette page représente chaque page qui sera créée (et chaque URL créée) par un user lorsqu'il crée un projet. On utilise les routes dynamiques pour faire ça.
 function ProjectPage() {

    const router = useRouter();
    const {project} = router.query;

    return (
    <>
        <Head>
            <title>{project}, a video game project conceived by a gamer</title>
        </Head>
        <Header/>
        <Project/>
    </>
    );
}

export default ProjectPage; 
