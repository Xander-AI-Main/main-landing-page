import React, { useEffect, useState } from 'react'
import styles from '../css/trainer.module.css'
import { Audio, Oval } from 'react-loader-spinner'
import { Dot } from 'react-animated-dots';
import ActualTrainer from './ActualTrainer';

export default function Trainer({fileData}) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2500)
    }, [])

    // console.log(fileData)

    return (
        <div className={styles.container}>
            <ActualTrainer fileData={fileData}/>
        </div>
    )
}
