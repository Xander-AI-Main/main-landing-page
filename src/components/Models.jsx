import React, { useState } from 'react'
import styles from '../css/models.module.css'
import axios from 'axios'
import ZeroStateScreen from './ZeroStateScreen'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, dracula  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Dropdown, Modal } from 'react-bootstrap'
import copy from '../assets/copy.svg'
import { toast } from 'react-toastify';

export default function Models({ data }) {
    const [interferenceCode, setInterferenceCode] = useState(``)
    const [terminalCode, setTerminalCode] = useState(`pip install scikit-learn tensorflow torch numpy nltk sentence_transformers pandas`)
    const [show, setShow] = useState(false)
    const [codes, setCodes] = useState([])

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
    async function download(item) {
        var helpers = []
        item.helpers && item.helpers.length > 0 && item.helpers.map((item, index) => {
            helpers.push(Object.values(item)[0])
        })
        console.log(helpers)
        helpers.push(item.modelUrl)
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
        <div className={styles.container}>
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
            {data?.trained_model_url && data?.trained_model_url?.length > 0 ? <div className={styles.sub__container}>
                <div className={styles.header}>Trained Models</div>
                <div className={styles.table__wrapper}>
                    <table className={styles.table}>
                        <thead className={styles.t__header}>
                            <tr>
                                <th className={styles.sno}>S. No.</th>
                                <th className={styles.model__name}>Model Name</th>
                                <th className={styles.task__name}>Task</th>
                                <th className={styles.model__type}>Model Type</th>
                                <th className={styles.model__type}>Interference Code</th>
                                <th className={styles.action}>Action</th>
                            </tr>
                        </thead>
                        <tbody className={styles.t__body}>
                            {
                                data?.trained_model_url && data?.trained_model_url?.length > 0 && data?.trained_model_url?.slice(0)?.reverse().map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            {item?.modelUrl !== "" ? <td style={{ width: '25%' }}>{item?.modelUrl && item?.modelUrl?.split("/")[item?.modelUrl?.split("/").length - 1].substring(0, 23)}...</td> 
                                            :
                                            <td style={{ width: '25%' }}>{item?.datasetUrl && item?.datasetUrl?.split("/")[item?.datasetUrl?.split("/").length - 1].substring(0, 23)}...</td>    
                                    }
                                            <td>{item?.task && item?.task.charAt(0).toUpperCase() + item?.task.slice(1)}</td>
                                            <td>{item?.modelArch && item?.modelArch[0] && item?.modelArch[0].length > 1 ? "Deep Learning" : "Machine Learning"}</td>
                                            <td className={styles.download} style={{ padding: '1.1rem 1rem 1.1rem 3rem' }} onClick={() => {
                                                setInterferenceCode(item?.interferenceCode)
                                                setCodes(item?.codes ? item?.codes : [{"python": ""}, {"javascript": ""}])
                                                setShow(true)
                                            }}>View Code</td>
                                            <td className={styles.download} style={{pointerEvents: item?.datasetUrl?.includes(".pdf") && "none", color: item?.datasetUrl?.includes(".pdf") && "rgb(180, 180, 180)"}} onClick={() => {
                                                download(item)
                                            }}>Download Model</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
                :
                <ZeroStateScreen type={"zero"} text={"Looks empty here!"} />
            }


        </div>
    )
}
