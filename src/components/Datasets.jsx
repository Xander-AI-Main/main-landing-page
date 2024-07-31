import React from 'react'
import styles from '../css/datasets.module.css'
import axios from 'axios'
import ZeroStateScreen from './ZeroStateScreen'

export default function Datasets({ data }) {
    console.log(data)
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
            {data?.dataset_url && data?.dataset_url?.length > 0 ? <div className={styles.sub__container}>
                <div className={styles.header}>Uploaded Datasets</div>
                <div className={styles.table__wrapper}>
                    <table className={styles.table}>
                        <thead className={styles.t__header}>
                            <tr>
                                <th className={styles.sno}>S. No.</th>
                                <th className={styles.model__name}>Dataset Name</th>
                                <th className={styles.task__name}>Task</th>
                                <th className={styles.model__type}>Model Type</th>
                                <th className={styles.action}>Action</th>
                            </tr>
                        </thead>
                        <tbody className={styles.t__body}>
                            {
                                data?.dataset_url && data?.dataset_url?.length > 0 && data?.dataset_url?.slice(0)?.reverse().map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.cloud_url && item?.cloud_url?.split("/")[item?.cloud_url?.split("/").length - 1].substring(0, 50)}</td>
                                            <td>{item?.task_type && item?.task_type.charAt(0).toUpperCase() + item?.task_type.slice(1)}</td>
                                            <td>{item?.architecture_details && item?.architecture_details.length > 1 ? "Deep Learning" : "Machine Learning"}</td>
                                            <td className={styles.download} onClick={() => {
                                                download(item.cloud_url)
                                            }}>Download Dataset</td>
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
