import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../css/contests.module.css'
import star from '../assets/star.svg'
import { BiChevronDown } from 'react-icons/bi'
import { signInWithEmailLink, isSignInWithEmailLink  } from "firebase/auth";
import { auth } from '../firebase/firebase'; 

export default function Contests() {
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
          }
    
          signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
              console.log("User signed in:", result.user);
              window.localStorage.removeItem('emailForSignIn');
            })
            .catch((error) => {
              console.error('Error signing in with email link:', error);
            });
        }
      }, []);
      
    const navigate = useNavigate()
    const [current, setCurrent] = useState(-1)
    useEffect(() => {
        if (!localStorage.getItem("userId")) {
            navigate('/?cameFrom=contest')
        }
    }, [])
    const allContests = [
        {
            "rewards": "$300",
            "max": 4,
            "min": 2,
            "link": "https://forms.gle/PAE94aEiQt1Wn3qB7",
            "contestType": "Team Contest"
        },
        {
            "rewards": "$100",
            "max": 2,
            "min": 1,
            "link": "https://forms.gle/PAE94aEiQt1Wn3qB7",
            "contestType": "Team Contest"
        },
        {
            "rewards": "$30",
            "max": 1,
            "min": 1,
            "link": "https://forms.gle/ethRikV73u368WpD7",
            "contestType": "Individual Contest"
        },
        {
            "rewards": "$12",
            "max": 1,
            "min": 1,
            "link": "https://forms.gle/ethRikV73u368WpD7",
            "contestType": "Individual Contest"
        },
    ]

    const guidelines = [
        "Participants must sign up on our platform to be eligible.",
        // "The contest starts on [Start Date] and ends on [End Date].",
        "All entries must be submitted by [Submission Deadline].",
        "Complete the required tasks using our no-code platform (e.g., upload a dataset, train a model, etc.).",
        "Submit your contest entry via the provided link on our website.",
        "The winner(s) will receive the said rewards.",
        // "Prizes will be distributed within [timeframe] after the contest ends.",
        // "Winners will be announced on [Announcement Date] via email and on our social media channels."
        "Winners will be announced via email and on our social media channels."
    ]

    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <span onClick={() => {
                    window.location.assign('https://platform.xanderco.in/main')
                }}>Xander</span>
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.bg__grad}></div>
                    <img src={star} alt="" className={styles.star} />
                    <div className={styles.texts}>
                        <span className={styles.gradient_}>Xander's Contest</span>
                        <span className={styles.lower}>Compete with your AI knowledge</span>
                    </div>
                    <img src={star} alt="" className={styles.star} />
                </div>
                <div className={styles.all__contests}>
                    {
                        allContests?.map((item, index) => {
                            return (
                                <div className={styles.current__contest}>
                                    <div className={styles.c__header}>
                                        <div className={styles.main__header}>
                                            <div className={styles.first}>
                                                <span>Contest - {index + 1}</span>
                                                <span>{item.contestType}</span>
                                            </div>
                                            <div className={styles.latter}>
                                                <span className={styles.rewards}>Rewards Worth</span>
                                                <span className={styles.gradient_} style={{fontSize: '22px'}}>{item.rewards}</span>
                                            </div>
                                        </div>

                                        <div className={styles.details}>
                                            <div className={styles.participant__data}>
                                                <span>Maximum Particpants: {item.max}</span>
                                                <span>Minimum Particpants: {item.min}</span>
                                            </div>
                                            <div className={styles.guidelines}>
                                                <div className={styles.main__guide} onClick={() => {
                                                    if(current == index) {
                                                        setCurrent(-1)
                                                    } else {
                                                        setCurrent(index)
                                                    }
                                                }}>
                                                    <span>Guidelines for the contest</span>
                                                    <BiChevronDown />
                                                </div>
                                                <div className={styles.register__now} onClick={() => {
                                                    window.location.assign(item.link)
                                                }}>
                                                    Register Now
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            current === index && <div className={styles.all__guidelines}>
                                                {
                                                    guidelines.map((elem, curr) => {
                                                        return (
                                                            <span>{curr+1}. {elem}</span>
                                                        )
                                                    })
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}