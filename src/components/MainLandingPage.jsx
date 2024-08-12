import React, { useEffect, useState } from 'react';
import styles from '../css/mainlanding.module.css';
import Services from './Services';
import Trainer from './Trainer';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import ZeroStateScreen from './ZeroStateScreen';
import { Modal } from 'react-bootstrap';
import { urls } from '../constants/constants';

export default function MainLandingPage({ collapsed }) {
  const [hasTrainingStarted, setHasTrainingStarted] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fileData, setFileData] = useState({});
  const [show, setShow] = useState(true)
  const [errorD, setErrorD] = useState("")

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

  const changeErrorDetails = (data) => {
    setErrorD(data)
  }

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
            changeErrorDetails={changeErrorDetails}
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
        {error && <ZeroStateScreen type={"error"} text={errorD === "" ? "Oops! It seems you have uploaded a wrong file!" : errorD} />}
      </div>

    </div>
  );
}
