import React, { useState } from 'react'
import styles from '../css/services.module.css'
import upload from '../assets/Upload.svg'
import axios from 'axios'

export default function Services({ changeState, changeLoadingState, changeFileData, collapsed, changeErrorState }) {
  const [display, setDisplay] = useState("flex")

  async function uploadFile(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', localStorage.getItem("userId"));

    changeLoadingState(true)
    setDisplay("none")

    await axios.post('http://127.0.0.1:8000/core/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data)
      changeFileData(response.data)
      changeLoadingState(false)
      changeState(true)
    }).catch(err => {
      changeErrorState(true)
      changeLoadingState(false)
      changeState(false)
      console.log(err)
    })
  }

  return (
    <div className={styles.container} style={{ display: display }}>
      <div className={styles.first}>
        <span className={styles.upload__header}>Upload Dataset</span>
        <div className={styles.mainService}>
          <label className={styles.uploadLabel}>
            <div className={styles.subService}>
              <div className={styles.choose}>
                <div className={styles.upload__icon}>
                  <img src={upload} alt="" />
                </div>
                <span className={styles.info}>Browse File</span>
                <input type="file" className={styles.hiddenInput} onChange={(e) => {
                  uploadFile(e)
                }} />
              </div>
            </div>
          </label>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.upload__header}>Coming Soon</span>
        <div className={styles.soon__services}>
          <div className={styles.service} style={{width: collapsed ? "27.5%" : "25%"}}>
            <span className={styles.header}>Create Your Dataset</span>
            {/* <span className={styles.info}>Coming Soon</span> */}
          </div>
          <div className={styles.service} style={{width: collapsed ? "27.5%" : "25%"}}>
            <span className={styles.header}>Choose Your Dataset</span>
            {/* <span className={styles.info}>Coming Soon</span> */}
          </div>
          <div className={styles.last__service}>
            <span className={styles.header}>Select An Industry</span>
            {/* <span className={styles.info}>Coming Soon</span> */}
          </div>
        </div>
      </div>
    </div>
  )
}
