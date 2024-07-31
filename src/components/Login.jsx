import React, { useState } from 'react'
import styles from '../css/login.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Login() {
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    email: '',
    password: '',
    username: ''
  })
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function login() {
    console.log(details)
    if ((details.email === "" && details.username === "") || details.password === "") {
      // alert("Please fill all the fields")
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
      if (details.email !== "" && !emailRegex.test(details.email)) {
        // alert('Invalid email address');
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
        await axios.post("https://api.xanderco.in/core/login/", {
          "username_or_email": details.email === "" ? details.username : details.email,
          "password": details.password
        }).then(res => {
          console.log(res.data)
          setDetails({
            email: '',
            password: '',
            username: ''
          })
          localStorage.setItem("userId", res.data.userId)
          navigate("/main")
          window.location.reload()
        }).catch(err => {
          console.log(err)
          // alert("User already exists")
          toast("An error occured!", {
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
            <span className={styles.welcome__text}>Welcome Back</span>
            <div className={styles.question} onClick={() => {
              navigate("/signup")
            }}>
              <span className={styles.first}>Don't have an account?</span>
              <span className={styles.second}>Sign Up</span>
            </div>
          </div>
          <div className={styles.inputs}>
            <div className={styles.email}>
              <span className={styles.email__header}>Email</span>
              <input className={styles.detail__input} type="text" placeholder="Enter you email" value={details.email} onChange={(e) => {
                setDetails({ ...details, email: e.target.value })
              }} />
            </div>
            <div className={styles.or}>
              <div className={styles.line1}></div>
              <span>OR</span>
              <div className={styles.line2}></div>
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
              login()
            }}>Log In</div>
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
