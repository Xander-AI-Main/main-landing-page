import React from 'react'
import styles from '../css/login.module.css'
import wave from "../assets/wave.png";

export default function AfterVeri() {
    return (
        <div className={styles.container}>
            <div className={styles.navbar__content}>
                <span>Xander</span>
            </div>
            <div className={styles.shadow}></div>
            <div className={styles.bg__wave}>
                <img src={wave} alt="wave" />
            </div>
            <span className={styles.mediocore}>Please check your email for confirmation! Check your spam too!</span>
        </div>
    )
}
