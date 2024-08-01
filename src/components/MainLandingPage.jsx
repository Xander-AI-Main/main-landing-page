import React, { useEffect, useState } from 'react';
import styles from '../css/mainlanding.module.css';
import Services from './Services';
import Trainer from './Trainer';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import ZeroStateScreen from './ZeroStateScreen';
import { Modal } from 'react-bootstrap';
import { urls } from '../constants/constants';
import info from '../assets/info.png'

export default function MainLandingPage({ collapsed }) {
  const [hasTrainingStarted, setHasTrainingStarted] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fileData, setFileData] = useState({});
  const [show, setShow] = useState(true)
  // console.log(collapsed);

  const changeState = (data) => {
    setHasTrainingStarted(data);
  };

  const changeLoadingState = (data) => {
    setLoading(data);
  };

  const changeErrorState = (data) => {
    setError(data);
  };

  const changeFileData = (data) => {
    setFileData(data);
  };

  async function getUsers() {
    await axios
      .get(`https://api.xanderco.in/core/update/?userId=${localStorage.getItem("userId")}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

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
    <div className={styles.container}>
      <Modal show={show} dialogClassName={styles.modal__main} onHide={() => setShow(false)} centered>
        <Modal.Header onHide={() => setShow(false)} className={styles.modal__header} closeButton>
          <span>
            Documentation for Datasets
          </span>
        </Modal.Header>
        <Modal.Body className={styles.modal__body}>
          <span className={styles.info}>Please read the following documentation carefully and checkout the example datasets:</span>
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
      <div className={styles.content}>
        {hasTrainingStarted ? (
          <Trainer fileData={fileData} />
        ) : (
          <Services
            changeState={changeState}
            changeLoadingState={changeLoadingState}
            changeFileData={changeFileData}
            collapsed={collapsed}
            changeErrorState={changeErrorState}
          />
        )}
        {loading && (
          <div className={styles.loader}>
            <BounceLoader color="#ffffff" />
            <div className={styles.pro__text}>
              <span>Processing</span>
              <div className={styles.bouncing_loader}>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        )}
        {error && <ZeroStateScreen type={"error"} text={"Oops! It seems you have uploaded a wrong file!"} />}
      </div>
      <div className={styles.documentation}>
        <img src={info} alt="" onClick={() => {
          setShow(true)
        }}/>
      </div>
    </div>
  );
}
