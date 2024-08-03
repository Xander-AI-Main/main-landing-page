import React, { useState } from 'react'
import styles from '../css/services.module.css'
import upload from '../assets/Upload.svg'
import axios from 'axios'
import { urls } from '../constants/constants'
import { Modal } from 'react-bootstrap'
import info from '../assets/info.png'

export default function Services({ changeState, changeLoadingState, changeFileData, collapsed, changeErrorState }) {
  const [display, setDisplay] = useState("flex")
  const [show, setShow] = useState(localStorage.getItem("hasAgreed") ? !localStorage.getItem("hasAgreed") : true)

  async function uploadFile(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', localStorage.getItem("userId"));

    changeLoadingState(true)
    setDisplay("none")

    await axios.post('https://api.xanderco.in/core/upload/', formData, {
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

  async function download(item) {
    const response = await axios.get(item, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', item.split("/")[item.split("/").length - 1]);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className={styles.container} style={{ display: display }}>
      <Modal show={show} dialogClassName={styles.modal__main} onHide={() => {
        setShow(false)
        localStorage.setItem("hasAgreed", true)
      }} centered>
        <Modal.Header onHide={() => {
          setShow(false)
          localStorage.setItem("hasAgreed", true)
        }} className={styles.modal__header} closeButton>
          <span>
            Documentation for Datasets
          </span>
        </Modal.Header>
        <Modal.Body className={styles.modal__body}>
          <span className={styles.info__h}>Please read the following documentation carefully and checkout the example datasets:</span>
          <div className={styles.info__main}>
            <div className={styles.info__header}>{'1)'} Regression</div>
            <span>• Dataset type will be of csv.</span>
            <span>• Final column will always be of observed values, and the rest of the columns will serve as variables.</span>
            <span className={styles.download} onClick={() => {
              download(urls["regression"])
            }}>Download example</span>
          </div>
          <div className={styles.info__main}>
            <div className={styles.info__header}>{'2)'} Classification</div>
            <span>• Dataset type will be of csv.</span>
            <span>• Final column will always be of observed values, and the rest of the columns will serve as variables.</span>
            <span className={styles.download} onClick={() => {
              download(urls["classification"])
            }}>Download example</span>
          </div>
          <div className={styles.info__main}>
            <div className={styles.info__header}>{'3)'} Textual</div>
            <span>• Dataset type will be of csv.</span>
            <span>• We currently offer text classification services like sentiment analyis, topic classification & spam detection.</span>
            <span>• Final column will always be of observed values, and the rest of the columns will serve as variables.</span>
            <span>• For sentiment analysis, there will be only two columns, i.e, one of the text and other of the sentiment type.</span>
            <span>• For topic classification, there will be only two columns, i.e, one of the text and other of the topic.</span>
            <span>• For spam detection, there will be only two columns, i.e, one of the text and other depicting whether the text is spam or not spam.</span>
            <span className={styles.download} onClick={() => {
              download(urls["text"])
            }}>Download example</span>
          </div>
          <div className={styles.info__main}>
            <div className={styles.info__header}>{'4)'} Image Classification</div>
            <span>• Dataset type to will be the zip of a folder.</span>
            <span>• That folder will consist of subfolders and the names of these subfolders will act as class names, and inside these subfolders there will be images.</span>
            <span className={styles.download} onClick={() => {
              download(urls["image"])
            }}>Download example</span>
          </div>
          <div className={styles.info__main}>
            <div className={styles.info__header}>{'5)'} Chatbot Creation</div>
            <span>• Dataset format will of JSON, i.e, user upload a json file. </span>
            <span>• Users will provide a json file, and in that json, for each object there will be two keys, namely question and answer.</span>
            <span className={styles.download} onClick={() => {
              download(urls["chatbot"])
            }}>Download example</span>
          </div>
        </Modal.Body>
      </Modal>
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
          <div className={styles.service} style={{ width: collapsed ? "27.5%" : "25%" }}>
            <span className={styles.header}>Create Your Dataset</span>
            {/* <span className={styles.info}>Coming Soon</span> */}
          </div>
          <div className={styles.service} style={{ width: collapsed ? "27.5%" : "25%" }}>
            <span className={styles.header}>Choose Your Dataset</span>
            {/* <span className={styles.info}>Coming Soon</span> */}
          </div>
          <div className={styles.last__service}>
            <span className={styles.header}>Select An Industry</span>
            {/* <span className={styles.info}>Coming Soon</span> */}
          </div>
        </div>
      </div>
      <div className={styles.documentation}>
        <img src={info} alt="" onClick={() => {
          setShow(true)
        }} />
      </div>
    </div>
  )
}
