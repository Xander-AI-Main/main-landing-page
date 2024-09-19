import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../css/actual.module.css'
import axios from 'axios'
import Papa from 'papaparse';
import { Dropdown, Modal } from 'react-bootstrap'
import copy from '../assets/copy.svg'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setRefetchModels } from '../Redux/Slices/noPersistXanderSlice';
import ProgressBarr from './ProgressBar';

export default function ActualTrainer({ fileData }) {
    const dispatch = useDispatch()
    const [isMl, setIsMl] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [hasEnded, setHasEnded] = useState(false)
    const [architecture, setArchitecture] = useState([])
    const [hyperparameters, setHyperparameters] = useState({})
    const [archType, setArchType] = useState('default')
    const [mainType, setMainType] = useState('DL')
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [progress, setProgress] = useState([]);
    const [finalModel, setFinalModel] = useState(null);
    const ref = useRef(null)
    const [interferenceCode, setInterferenceCode] = useState(``)
    const [terminalCode, setTerminalCode] = useState(`pip install scikit-learn tensorflow torch numpy nltk sentence_transformers pandas`)
    const [show, setShow] = useState(false)
    const [codes, setCodes] = useState([])
    const [currentEpoch, setCurrentEpoch] = useState(0)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(interferenceCode);
            toast("Copied to clipboard!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const copyToClipboardGeneral = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            toast("Copied to clipboard!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const copyTerminalToClip = async () => {
        try {
            await navigator.clipboard.writeText(terminalCode);
            toast("Copied to clipboard!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleRowSelection = (csvData, index) => {
        if (csvData.length > 0) {
            const row = csvData[index];
            if (row) {
                const rowWithoutLastColumn = row.slice(0, -1);
                return rowWithoutLastColumn
            }
        }
    };

    useEffect(() => {
        console.log(fileData)
        if (fileData.architecture_details.length > 2) {
            setIsMl(false)
            setMainType('DL')
        } else {
            setMainType('ML')
        }
        setArchitecture(fileData.architecture_details)
        setHyperparameters(fileData.hyperparameter)
    }, [fileData])

    const figureOutArch = (arch) => {
        if (fileData.architecture_details.length === 1) {
            return `Using ${fileData.architecture_details[0].layer}`
        } else {
            const obj = {}
            arch.map((item) => {
                if (obj[item.layer]) {
                    obj[item.layer] = obj[item.layer] + 1
                } else {
                    obj[item.layer] = 1
                }
            })
            let string = "Using "
            for (const key in obj) {
                string += `${obj[key]} ${key} layers, `
            }
            return string.slice(0, string.length - 2)
        }
    }

    const userId = localStorage.getItem("userId");
    const handleStartTraining = async () => {
        setHasStarted(true);
        dispatch(setRefetchModels(false))
        const trainingData = {
            dataset_url: fileData.cloud_url,
            hasChanged: false,
            task: fileData.task_type,
            mainType: mainType,
            archType: archType,
            userId: userId,
            hyperparameters: hyperparameters
        };

        await axios.post('https://apiv3.xanderco.in/core/train/', trainingData).then((res) => {
            console.log(res.data)
            setFinalModel(res.data)
            setProgress(res.data.epoch_data ? res.data.epoch_data : [])
            setHasEnded(true)
            dispatch(setRefetchModels(true))
            setInterferenceCode(res.data.interferenceCode)
            setCodes(res.data.codes)
        }).catch(err => {
            console.log(err)
        })
    };

    useEffect(() => {
        const newSocket = new WebSocket(`wss://apiv3.xanderco.in/ws/data/${userId}/`);

        setSocket(newSocket);

        if (newSocket) {
            newSocket.onopen = () => {
                console.log('WebnewSocket connection established');
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.modelUrl) {
                    setHasEnded(true)
                    setFinalModel(data)

                } else {
                    setCurrentEpoch(parseInt(data.epoch))
                    setProgress(progress => [...progress, data])
                }
                console.log(data)
                if (document.getElementById("scroll")) {
                    document.getElementById("scroll").scrollBy({ top: document.getElementById("scroll").scrollTop + 30 })
                }
            };

            newSocket.onclose = () => {
                console.log('WebnewSocket connection closed');
            };

            return () => {
                newSocket.close();
            };
        }
    }, []);

    async function download() {
        var helpers = []
        finalModel.helpers && finalModel.helpers.length > 0 && finalModel.helpers.map((item, index) => {
            helpers.push(Object.values(item)[0])
        })
        console.log(helpers)
        helpers.push(finalModel.modelUrl)
        for (const file of helpers) {
            const response = await axios.get(file, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.split("/")[file.split("/").length - 1]);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} dialogClassName={styles.code__main}>
                <Modal.Header closeButton onHide={() => setShow(false)} className={styles.code__header}>
                    Copy Interference Code
                </Modal.Header>
                <Modal.Body className={styles.code__body}>
                    {/* <div className={styles.file__stuff}>
                        <span className={styles.file__first}>{"1)"} Firstly create a python file named interference.py</span>
                    </div>
                    <div className={styles.terminal__stuff}>
                        <span className={styles.terminal__first}>{"2)"} Now paste and run the following code in you terminal:</span>
                        <div className={styles.code__section__main}>
                            <div className={styles.section__header}>
                                <span>python</span>
                                <div onClick={() => {
                                    copyTerminalToClip()
                                }}>
                                    <img src={copy} alt="" />
                                    <span>Copy Code</span>
                                </div>
                            </div>
                            <div className={styles.code__section}>
                                {terminalCode}
                            </div>
                        </div>
                    </div>
                    <div className={styles.main__code}>
                        <span className={styles.terminal__first}>{"3)"} Now paste the following code in interference.py:</span>
                        <div className={styles.code__section__main}>
                            <div className={styles.section__header}>
                                <span>python</span>
                                <div onClick={() => {
                                    copyToClipboard()
                                }}>
                                    <img src={copy} alt="" />
                                    <span>Copy Code</span>
                                </div>
                            </div>
                            <div className={styles.code__section}>

                                <SyntaxHighlighter language="python" style={dracula}>
                                    {interferenceCode}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div> */}
                    <div className={styles.main__code}>
                        <span className={styles.terminal__first}>{"1)"} Code for using api in python:</span>
                        <div className={styles.code__section__main}>
                            <div className={styles.section__header}>
                                <span>Python</span>
                                <div onClick={() => {
                                    copyToClipboardGeneral(codes[0]["python"])
                                }}>
                                    <img src={copy} alt="" />
                                    <span>Copy Code</span>
                                </div>
                            </div>
                            <div className={styles.code__section}>
                                {/* <pre><code>
                                    {interferenceCode}
                                </code></pre> */}
                                <SyntaxHighlighter language="python" style={dracula}>
                                    {codes[0] && codes[0]["python"] && codes[0]["python"]}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                    <div className={styles.main__code}>
                        <span className={styles.terminal__first}>{"2)"} Code for using api in javascript:</span>
                        <div className={styles.code__section__main}>
                            <div className={styles.section__header}>
                                <span>Python</span>
                                <div onClick={() => {
                                    copyToClipboardGeneral(codes[1]["javascript"])
                                }}>
                                    <img src={copy} alt="" />
                                    <span>Copy Code</span>
                                </div>
                            </div>
                            <div className={styles.code__section}>
                                {/* <pre><code>
                                    {interferenceCode}
                                </code></pre> */}
                                <SyntaxHighlighter language="javascript" style={dracula}>
                                    {codes[1] && codes[1]["javascript"] && codes[1]["javascript"]}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <div className={styles.container}>
                <div className={styles.task__details}>
                    <span className={styles.task__name}>{fileData.task_type.charAt(0).toUpperCase() + fileData.task_type.slice(1)}</span>
                    <ProgressBarr progress={(currentEpoch / hyperparameters.epochs) * 100} />
                    {/* <span className={styles.arch__header}>Architecture</span>
                    <div className={styles.type__details}>
                        <span>Type: </span>
                        <div>{isMl ? "Machine Learning" : "Deep Learning"}</div>
                    </div>
                    <div className={styles.type__details}>
                        <span>Architecture Used: </span>
                        <div>{figureOutArch(architecture)}</div>
                    </div> */}
                    <div className={styles.arch__details}>
                        <div className={styles.model__type}>
                            <span>TYPE</span>
                            <div>{isMl ? "Machine Learning" : "Deep Learning"}</div>
                        </div>
                        <div className={styles.model__arch}>
                            <span>ARCHITECTTURE</span>
                            <div className={styles.ok}>{figureOutArch(architecture)}</div>
                        </div>
                    </div>
                </div>
                {!hasStarted && Object.keys(hyperparameters).length > 0 && <div className={styles.hyperparameters}>
                    <span className={styles.param__header}>Hyperparameters</span>
                    <div className={styles.all__params}>
                        {
                            Object.keys(hyperparameters).map((item, index) => {
                                return (
                                    <div className={styles.current__params}>
                                        <span className={styles.param__name}>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                                        <input type="number" className={styles.param__value} value={hyperparameters[item]} onChange={(e) => {
                                            if (item === "validation_size") {
                                                if (parseFloat(e.target.value) <= 0.4) {
                                                    let arr = { ...hyperparameters }
                                                    arr[item] = parseFloat(e.target.value)
                                                    setHyperparameters(arr)
                                                } else {
                                                    toast("Validation size can't be greater than 0.4", {
                                                        position: "top-right",
                                                        autoClose: 4000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "dark",
                                                      });
                                                }
                                            } else {
                                                let arr = { ...hyperparameters }
                                                arr[item] = parseInt(e.target.value)
                                                setHyperparameters(arr)
                                            }

                                        }} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>}
                {!hasStarted && <div className={styles.start__training} onClick={() => handleStartTraining()}>START TRAINING</div>}
                {
                    hasStarted && <div className={styles.training__main}>
                        <div className={styles.training__text}>
                            <span>
                                {hasEnded ? 'Training Completed' : 'Training'}
                            </span>
                            {!hasEnded && <div className={styles.bouncing_loader}>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>}
                        </div>
                        {!isMl && <div className={styles.training__data} ref={ref} id='scroll'>
                            {
                                progress.map((item, index) => {
                                    return (
                                        <div className={styles.current__train__info}>
                                            <span>Epoch: {item.epoch}</span>
                                            <div>{(item.train_acc && ("Train Accuracy: " + (item.train_acc * 100).toFixed(2).toString() + "%"))} {(item.train_loss && ("Train Loss: " + item.train_loss.toFixed(2).toString()))} {(item.test_loss && ("Test Loss: " + item.test_loss.toFixed(2).toString()))} {(item.test_acc && ("Test Accuracy: " + (item.test_acc * 100).toFixed(2).toString() + "%"))}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>}
                        {hasEnded && <div className={styles.training__btns}>
                            <div className={styles.download__model} onClick={() => {
                                download()
                            }}>Download Model</div>
                            <div className={styles.copy__code} onClick={() => {
                                // copyToClipboard()
                                setShow(true)
                            }}>View Code</div>
                            {/* <div className={styles.copy__code} onClick={() => {
                                window.location.reload()
                            }}>Return Home</div> */}
                        </div>}
                    </div>
                }
            </div>
        </>
    )
}
