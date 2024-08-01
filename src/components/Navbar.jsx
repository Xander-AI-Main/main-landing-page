import React from 'react'
import styles from '../css/navbar.module.css'
import person from '../assets/Ellipse 13.svg'
import { FaCaretDown } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

export default function Navbar({ data, collapsed }) {
  const navigate = useNavigate()

  return (
    <div className={styles.navbar}>
      <span style={{opacity: collapsed ? "0" : "1", pointerEvents: collapsed && "none"}} onClick={() => {
        navigate('/main')
        // window.location.reload()
      }}>Xander</span>
      <div className={styles.complete}>
        <div className={styles.username__thing}>
          {/* <div className={styles.username__thing__icon}>{data?.username && data?.username[0] && data?.username[0].toUpperCase()}</div> */}
          <img src={data.photo !== "" ? data.photo : person} alt="" className={styles.username__thing__icon} />
          <span>{data.username && data.username.toUpperCase()}</span>
        </div>
        <FaCaretDown color='#fff' className={styles.drop}/>
      </div>
    </div>
  )
}
