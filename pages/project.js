import styles from '../styles/project.module.css';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


export default function Project() {

    

    return (
        <div className={styles.projectPage}>
            <Header />
            <h1>Project Page</h1>
        </div>
    );
}
