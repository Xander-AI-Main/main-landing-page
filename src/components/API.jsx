import React, { useState } from 'react'
import styles from '../css/api.module.css'
import { Modal } from 'react-bootstrap'

export default function API() {
    const data = [
        {
            name: "any",
            value: "xn-ssdvfbg",
            date: "25/03/2025",
        },
        {
            name: "any",
            value: "xn-ssdvfbg",
            date: "25/03/2025",
        },
        {
            name: "any",
            value: "xn-ssdvfbg",
            date: "25/03/2025",
        },
        {
            name: "any",
            value: "xn-ssdvfbg",
            date: "25/03/2025",
        },
        {
            name: "any",
            value: "xn-ssdvfbg",
            date: "25/03/2025",
        },
        {
            name: "any",
            value: "xn-ssdvfbg",
            date: "25/03/2025",
        },
    ]
    const [show, setShow] = useState(false)
    const [name, setName] = useState('')

    return (
        <div className={styles.container}>
            <Modal show={show} onHide={() => setShow(false)} dialogClassName={styles.code__main}>
                <Modal.Header closeButton onHide={() => setShow(false)} className={styles.code__header}>
                    Add API Key
                </Modal.Header>
                <Modal.Body className={styles.code__body}>
                    <input type="text" value={name} placeholder='Enter a name' onChange={(e) => {
                        setName(e.target.value)
                    }}/>
                    <div className={styles.buttons}>
                        <div className={styles.cancel} onClick={() => setShow(false)}>Cancel</div>
                        <div className={styles.save} onClick={() => setShow(false)}>Save</div>
                    </div>
                </Modal.Body>
            </Modal>
            <div className={styles.header}>
                <span>
                    API Keys
                </span>
                <div className={styles.add} onClick={() => {
                    setShow(true)
                }}>
                    + Create an API key
                </div>
            </div>
            <div className={styles.text}>
                API Keys authenticate your identity to the Xander CLI and allow applications to perform actions based on token permissions. Do not share your API Keys with anyone; we regularly check for leaked API Keys and remove them immediately.
            </div>
            <div className={styles.table__wrapper}>
                <table className={styles.table}>
                    <thead className={styles.t__header}>
                        <tr>
                            <th className={styles.sno}>S. No.</th>
                            <th className={styles.model__name}>Name</th>
                            <th className={styles.task__name}>Value</th>
                            <th className={styles.model__type}>Creation Date</th>
                            <th className={styles.model__type}>Action</th>
                        </tr>
                    </thead>
                    <tbody className={styles.t__body}>
                        {
                            data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.name}</td>
                                        <td>{item?.value}</td>
                                        <td style={{ padding: '1.1rem 1rem 1.1rem 2rem' }} onClick={() => {
                                        }}>{item?.date}</td>
                                        <td className={styles.download} style={{ pointerEvents: item?.datasetUrl?.includes(".pdf") && "none", color: item?.datasetUrl?.includes(".pdf") && "rgb(180, 180, 180)" }} onClick={() => {
                                        }}>Delete</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
