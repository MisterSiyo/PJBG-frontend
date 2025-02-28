import styles from '../styles/layout.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    

    return (
        <>
            <h2>Top Projects</h2>
            <div>
                <ProjectInfo />
                <ProjectInfo />
                <ProjectInfo />
                <ProjectInfo />
            </div>
        </>
    )
}