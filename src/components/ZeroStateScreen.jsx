import React from 'react'
import styles from '../css/zero.module.css'
import man from '../assets/man.png'
import error from '../assets/error.png'

export default function ZeroStateScreen({type, text}) {
  return (
    <div className={styles.container} style={{height: type === "error" && "77vh"}}>
       <div className={styles.actual__shingle}>
            {
                type === "zero" ? <img src={man} alt="" /> : <img src={error} alt="" />
            }
            <span>{text}</span>
            {
                type === "error" && <button onClick={() => {
                    window.location.reload()
                }}>Return Home</button>
            }
       </div>
    </div>
  )
}
