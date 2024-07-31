import React, { useEffect, useState } from 'react'
import styles from '../css/profile.module.css'
import axios from 'axios'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import person from '../assets/Ellipse 13.svg'
import { BiPencil } from 'react-icons/bi'

export default function Profile() {
  const [data, setData] = useState({})

  async function getUsers() {
    await axios.get(`http://127.0.0.1:8000/core/update/?userId=${localStorage.getItem("userId")}`).then(res => {
      console.log(res.data)
      setData(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const files = new FormData();

    files.append("bucketName", "idesign-quotation");
    files.append("files", file);

    await axios.put(`https://s3-api-uat.idesign.market/api/upload`, files)
      .then(async function (response) {
        console.log(response?.data?.locations[0])
        await axios.put('http://127.0.0.1:8000/core/update/', {
          userId: localStorage.getItem("userId"),
          photo: response?.data?.locations[0],
        }).then(res => {
          console.log(res.data)
          setData(res.data)
          alert("Profile photo updated!")
        }).catch(err => {
          console.log(err)
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile__pic}>
        <span>Profile Photo</span>
        <div className={styles.edit}>
          <img src={(data.photo === "" || data.photo === undefined) ? person : data.photo} alt="" />
          <div>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                handleFileChange(e)
              }}
            />
            <label htmlFor="file-upload" className={styles.edit__text}>
              <BiPencil color='#fff' style={{ width: '1.2rem', height: '1.2rem', marginRight: '0.8rem' }} />
              <span>Change Profile Photo</span>
            </label>
          </div>
        </div>
      </div>
      <div className={styles.user__details}>
        <span className={styles.user__header}>User Details</span>
        <div className={styles.sub__user__details}>
          <div className={styles.email}>
            <span className={styles.email__header}>Email</span>
            <input className={styles.detail__input} type="text" placeholder="Enter you email" value={data?.email ? data.email : ""} onChange={(e) => {
            }} />
          </div>
          <div className={styles.email}>
            <span className={styles.username__header}>Username</span>
            <input className={styles.detail__input} type="text" placeholder="Enter you email" value={data?.username ? data.username : ""} onChange={(e) => {
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
