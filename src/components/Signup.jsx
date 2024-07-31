import React, { useState } from 'react'
import styles from '../css/login.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Signup() {
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    email: '',
    password: '',
    username: '',
    plan: 'free',
    max_storage_allowed: 5,
    max_cpu_hours_allowed: 5,
    max_gpu_hours_allowed: 0
  })
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function signup() {
    console.log(details)
    if (details.email === "" || details.password === "" || details.username === "") {
      toast("Please fill all the fields", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      if (!emailRegex.test(details.email)) {
        toast("Invalid Email Address", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        await axios.post("https://api.xanderco.in/core/signup/signup//", details).then(res => {
          console.log(res.data)
          setDetails({
            email: '',
            password: '',
            username: '',
            plan: 'free',
            max_storage_allowed: 5,
            max_cpu_hours_allowed: 5,
            max_gpu_hours_allowed: 0
          })
          localStorage.setItem("userId", res.data.userId)
          navigate("/main")
          window.location.reload()
        }).catch(err => {
          console.log(err)
          toast("User already exists!", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark", 
          });
        })
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.navbar__content}>
        <span>Xander</span>
      </div>
      <div className={styles.main}>
        <div className={styles.details}>
          <div className={styles.texts}>
            <span className={styles.welcome__text}>Get Started</span>
            <div className={styles.question} onClick={() => {
              navigate("/login")
            }}>
              <span className={styles.first}>Already have an account?</span>
              <span className={styles.second}>Log in</span>
            </div>
          </div>
          <div className={styles.inputs}>
            <div className={styles.email}>
              <span className={styles.email__header}>Email</span>
              <input className={styles.detail__input} type="text" placeholder="Enter you email" value={details.email} onChange={(e) => {
                setDetails({ ...details, email: e.target.value })
              }} />
            </div>
            <div className={styles.email}>
              <span className={styles.username__header}>Username</span>
              <input className={styles.detail__input} type="text" placeholder="Enter your username" value={details.username} onChange={(e) => {
                setDetails({ ...details, username: e.target.value })
              }} />
            </div>
            <div className={styles.email}>
              <span className={styles.password__header}>Password</span>
              <input className={styles.detail__input} type="password" placeholder="Enter your password" value={details.password} onChange={(e) => {
                setDetails({ ...details, password: e.target.value })
              }} />
            </div>
            <div className={styles.login__btn} onClick={() => {
              signup()
            }}>Sign Up</div>
          </div>
        </div>
        <div className={styles.gradient__bg}></div>
        <div className={styles.boxes}>
          <div className={styles.box1}></div>
          <div className={styles.box2}></div>
          <div className={styles.box3}></div>
          <div className={styles.box4}></div>
        </div>
      </div>
    </div>
  )
}
