import React from 'react'
import styles from '../css/navbar.module.css'
import person from '../assets/Ellipse 13.svg'
import { FaCaretDown } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

export default function Navbar({ data, collapsed }) {
  const navigate = useNavigate()

  return (
    <div className={styles.navbar}>
      <span style={{ opacity: collapsed ? "0" : "1", pointerEvents: collapsed && "none" }} onClick={() => {
        if (window.location.href.includes("main")) {
          window.location.reload()
        }
        navigate('/main')
      }}>Xander</span>
      <div className={styles.complete}>
        <div className={styles.username__thing}>
          {/* <div className={styles.username__thing__icon}>{data?.username && data?.username[0] && data?.username[0].toUpperCase()}</div> */}
          <img src={data.photo !== "" ? data.photo : person} alt="" className={styles.username__thing__icon} />
          <span>{data.username && data.username.toUpperCase()}</span>
        </div>
        {/* <FaCaretDown color='#fff' className={styles.drop} /> */}
        <Dropdown>
          <Dropdown.Toggle style={{background: 'none', border: 'none', padding: '0.15rem'}}>
            {/* <FaCaretDown color='#fff' className={styles.drop} /> */}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.menu}>
            <Dropdown.Item onClick={() => {
              localStorage.clear()
              window.location.assign("https://platform.xanderco.in")
            }}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
