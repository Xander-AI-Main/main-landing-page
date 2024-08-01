import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../css/actual.module.css'
import axios from 'axios'
import Papa from 'papaparse';
import { Dropdown, Modal } from 'react-bootstrap'
import copy from '../assets/copy.svg'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';

export default function ActualTrainer({ fileData }) {
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
        const trainingData = {
            dataset_url: fileData.cloud_url,
            hasChanged: false,
            task: fileData.task_type,
            mainType: mainType,
            archType: archType,
            userId: userId,
            hyperparameters: hyperparameters
        };

        await axios.post('https://api.xanderco.in/core/train/', trainingData).then((res) => {
            console.log(res.data)
            setFinalModel(res.data)
            setProgress(res.data.epoch_data ? res.data.epoch_data : [])
            setHasEnded(true)
            setInterferenceCode(res.data.interferenceCode)
            //             if (res.data.task === "regression") {
            //                 let dat = []
            //                 fetch(fileData.cloud_url)
            //                     .then(response => response.text())
            //                     .then(data => {
            //                         Papa.parse(data, {
            //                             complete: (result) => {
            //                                 console.log(result.data)
            //                                 dat = handleRowSelection(result.data, parseInt(Math.random() * result.data.length))
            //                                 console.log(dat)

            //                                 const formattedDat = dat.map(item => {
            //                                     return isNaN(item) ? `'${item}'` : item;
            //                                 });
            // //                                 setInterferenceCode(`
            // // import numpy as np
            // // import tensorflow as tf
            // // import joblib
            // // import requests
            // // import io
            // // import pandas as pd


            // // model_url = '${res.data.modelUrl}'    
            // // scaler_url = '${res.data.helpers[0]["scaler"]}'  
            // // dataset_url = '${fileData.cloud_url}'  
            // // input_data = [${formattedDat.join(', ')}] # your input data

            // // def download_file(url, local_path):
            // //     response = requests.get(url)
            // //     if response.status_code == 200:
            // //         with open(local_path, 'wb') as f:
            // //             f.write(response.content)
            // //         print(f"Downloaded {url} to {local_path}")
            // //     else:
            // //         print(f"Failed to download {url}: {response.status_code}")

            // // def load_model_from_local(path):
            // //     try:
            // //         model = tf.keras.models.load_model(path)
            // //         return model
            // //     except Exception as e:
            // //         print(f"Error loading model from {path}: {e}")
            // //         return None

            // // def load_scaler(url):
            // //     response = requests.get(url)
            // //     if response.status_code == 200:
            // //         scaler_content = response.content
            // //         try:
            // //             scaler = joblib.load(io.BytesIO(scaler_content))
            // //             return scaler
            // //         except Exception as e:
            // //             print(f"Error loading scaler: {e}")
            // //             return None
            // //     else:
            // //         print(f"Failed to download scaler: {response.status_code}")
            // //         return None

            // // # Download the model and scaler
            // // model_path = model_url.split('/')[-1]
            // // download_file(model_url, model_path)

            // // scaler = load_scaler(scaler_url)

            // // # Load the model from the local file
            // // model = load_model_from_local(model_path)

            // // if model and scaler:
            // //     def preprocess_input(data, scaler, categorical_columns, column_names):
            // //         df = pd.DataFrame([data], columns=column_names)
            // //         df = pd.get_dummies(df, columns=categorical_columns)
            // //         print(scaler.feature_names_in_)
            // //         df = df.reindex(columns=scaler.feature_names_in_, fill_value=0)
            // //         data_scaled = scaler.transform(df)
            // //         return data_scaled

            // //     def make_predictions(model, data_scaled):
            // //         predictions = model.predict(data_scaled)
            // //         return predictions

            // //     df = pd.read_csv(dataset_url)
            // //     column_names = df.columns.drop(df.columns[-1])
            // //     categorical_columns = df.select_dtypes(include=['object']).columns

            // //     data_scaled = preprocess_input(input_data, scaler, categorical_columns, column_names)
            // //     predictions = make_predictions(model, data_scaled)

            // //     print(predictions)
            // // else:
            // //     print("Failed to load model or scaler.")
            // //                     `)
            //                             },
            //                             header: false,
            //                         });
            //                     })
            //                     .catch(error => console.error('Error fetching CSV file:', error));

            //             }
            //             else if (res.data.task === "classification") {
            //                 let dat = []
            //                 fetch(fileData.cloud_url)
            //                     .then(response => response.text())
            //                     .then(data => {
            //                         Papa.parse(data, {
            //                             complete: (result) => {
            //                                 console.log(result.data)
            //                                 dat = handleRowSelection(result.data, parseInt(Math.random() * result.data.length))
            //                                 console.log(dat)

            //                                 const formattedDat = dat.map(item => {
            //                                     return isNaN(item) ? `'${item}'` : item;
            //                                 });

            //                                 setInterferenceCode(`
            // import numpy as np
            // import pandas as pd
            // import tensorflow as tf
            // import joblib
            // import requests
            // import io
            // from sklearn.preprocessing import StandardScaler
            // from sklearn.model_selection import train_test_split
            // from sklearn.metrics import accuracy_score

            // dataset_url = '${fileData.cloud_url}'
            // model_url = '${res.data.modelUrl}'
            // scaler_url = '${res.data.helpers[0]["scaler"]}'
            // input_data = [${formattedDat.join(', ')}] # your input data

            // def download_file(url, local_path):
            //     response = requests.get(url)
            //     if response.status_code == 200:
            //         with open(local_path, 'wb') as f:
            //             f.write(response.content)
            //         print(f"Downloaded {url} to {local_path}")
            //     else:
            //         print(f"Failed to download {url}: {response.status_code}")

            // def load_model_from_local(path):
            //     try:
            //         model = tf.keras.models.load_model(path)
            //         return model
            //     except Exception as e:
            //         print(f"Error loading model from {path}: {e}")
            //         return None

            // def load_scaler(url):
            //     response = requests.get(url)
            //     if response.status_code == 200:
            //         scaler_content = response.content
            //         try:
            //             scaler = joblib.load(io.BytesIO(scaler_content))
            //             return scaler
            //         except Exception as e:
            //             print(f"Error loading scaler: {e}")
            //             return None
            //     else:
            //         print(f"Failed to download scaler: {response.status_code}")
            //         return None

            // def preprocess_input(data, scaler, categorical_columns, column_names):
            //     df = pd.DataFrame([data], columns=column_names)
            //     df = pd.get_dummies(df, columns=categorical_columns)
            //     df = df.reindex(columns=scaler.feature_names_in_, fill_value=0)
            //     data_scaled = scaler.transform(df)
            //     return data_scaled

            // def make_predictions(model, data_scaled):
            //     predictions_proba = model.predict(data_scaled)
            //     predictions = (predictions_proba > 0.5).astype(int)
            //     return predictions, predictions_proba

            // if __name__ == "__main__":
            //     model_path = model_url.split('/')[-1]
            //     download_file(model_url, model_path)
            //     scaler = load_scaler(scaler_url)

            //     model = load_model_from_local(model_path)

            //     if model and scaler:
            //         df = pd.read_csv(dataset_url)
            //         column_names = df.columns.drop(df.columns[-1])
            //         categorical_columns = df.select_dtypes(include=['object']).columns

            //         data_scaled = preprocess_input(input_data, scaler, categorical_columns, column_names)

            //         predictions, predictions_proba = make_predictions(model, data_scaled)

            //         print(f"Predicted class: {predictions[0][0]}")
            //         print(f"Prediction probability: {predictions_proba[0][0]}")
            //     else:
            //         print("Failed to load model or scaler.")

            //                     `)
            //                             },
            //                             header: false,
            //                         });
            //                     })
            //                     .catch(error => console.error('Error fetching CSV file:', error));

            //             }
            //             if (res.data.task === "chatbot") {
            //                 setInterferenceCode(`
            // import requests
            // import torch
            // import zipfile
            // from sentence_transformers import SentenceTransformer
            // import os
            // import re 
            // import nltk
            // from nltk.corpus import stopwords
            // from nltk.tokenize import word_tokenize
            // from sentence_transformers import util
            // import requests
            // import json

            // model_zip_url = '${res.data.modelUrl}'

            // extract_folder = './sentence_transformer_model'

            // os.makedirs(extract_folder, exist_ok=True)

            // print("Downloading model zip file...")
            // response = requests.get(model_zip_url, stream=True)
            // zip_file_path = './sentence_transformer_model.zip'

            // with open(zip_file_path, 'wb') as file:
            //     for chunk in response.iter_content(chunk_size=1024):
            //         if chunk:
            //             file.write(chunk)

            // print("Unzipping model...")
            // with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            //     zip_ref.extractall(extract_folder)

            // model_path = os.path.join('sentence_transformer_model')
            // model = SentenceTransformer(model_path)

            // question_embeddings_url = '${res.data.helpers[0]["question_embeddings"]}'
            // answer_embeddings_url =  '${res.data.helpers[1]["answer_embeddings"]}'

            // response = requests.get(question_embeddings_url)
            // with open(question_embeddings_url.split("/")[-1], 'wb') as file:
            //     file.write(response.content)

            // response = requests.get(answer_embeddings_url)
            // with open(answer_embeddings_url.split("/")[-1], 'wb') as file:
            //     file.write(response.content)

            // question_embeddings = torch.load(question_embeddings_url.split("/")[-1])
            // answer_embeddings = torch.load(answer_embeddings_url.split("/")[-1])

            // nltk.download('punkt')
            // nltk.download('stopwords')

            // data_url = '${fileData.cloud_url}'

            // response = requests.get(data_url)
            // qa_data = json.loads(response.text)
            // questions = [item['question'] for item in qa_data]
            // answers = [item['answer'] for item in qa_data]

            // questions = [item['question'] for item in qa_data]
            // answers = [item['answer'] for item in qa_data]

            // stop_words = set(stopwords.words('english'))

            // def preprocess_text(text):
            //     text = text.lower()
            //     text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)  
            //     text = re.sub(r'\s+', ' ', text).strip()  
            //     tokens = word_tokenize(text)
            //     tokens = [word for word in tokens if word not in stop_words]
            //     return ' '.join(tokens)

            // def get_answer(question):
            //     processed_question = preprocess_text(question)
            //     question_embedding = model.encode(processed_question, convert_to_tensor=True)

            //     similarities = util.pytorch_cos_sim(question_embedding, question_embeddings)[0]
            //     top_results = similarities.topk(k=5)
            //     print(top_results)
            //     similarity, index = similarities.max(), similarities.argmax()
            //     similarity_percentage = similarity.item() * 100

            //     if similarity_percentage > 45:
            //         return answers[index], similarity_percentage
            //     else: 
            //         return "Sorry, I didn't understand that!", similarity_percentage

            // user_question = "What is munafa"
            // answer, similarity_percentage = get_answer(user_question)

            // print(f"Answer: {answer}")
            // print(f"Similarity Percentage: {similarity_percentage:.2f}%")
            //                     `)
            //             }
            //             if (res.data.task === "text") {
            //                 setInterferenceCode(`
            // import pandas as pd
            // import numpy as np
            // import tensorflow as tf
            // from tensorflow.keras.preprocessing.sequence import pad_sequences
            // import requests
            // import pickle
            // import io

            // # URLs of the uploaded model and helpers
            // model_url = '${res.data.modelUrl}' # URL to the saved model
            // tokenizer_url = '${res.data.helpers[0]["tokenizer"]}' # URL to the saved tokenizer
            // label_encoder_url = '${res.data.helpers[1]["label_encoder"]}' # URL to the saved label encoder

            // # Function to download file from URL
            // def download_file(url):
            //     response = requests.get(url)
            //     if response.status_code == 200:
            //         return response.content
            //     else:
            //         print(f"Failed to download {url}: {response.status_code}")
            //         return None

            // # Load the model
            // def load_model(url):
            //     model_content = download_file(url)
            //     if model_content:
            //         with open(model_url.split("/")[-1], 'wb') as f:
            //             f.write(model_content)
            //         model = tf.keras.models.load_model(model_url.split("/")[-1])
            //         return model
            //     return None

            // # Load the tokenizer
            // def load_tokenizer(url):
            //     tokenizer_content = download_file(url)
            //     if tokenizer_content:
            //         tokenizer = pickle.load(io.BytesIO(tokenizer_content))
            //         return tokenizer
            //     return None

            // # Load the label encoder
            // def load_label_encoder(url):
            //     label_encoder_content = download_file(url)
            //     if label_encoder_content:
            //         label_encoder = pickle.load(io.BytesIO(label_encoder_content))
            //         return label_encoder
            //     return None

            // # Preprocess the input text
            // def preprocess_text(text, tokenizer, max_sequence_length):
            //     sequences = tokenizer.texts_to_sequences([text])
            //     padded_sequences = pad_sequences(sequences, maxlen=max_sequence_length)
            //     return padded_sequences

            // # Make predictions
            // def make_predictions(text, model, tokenizer, label_encoder, max_sequence_length):
            //     preprocessed_text = preprocess_text(text, tokenizer, max_sequence_length)
            //     predictions = model.predict(preprocessed_text)
            //     predicted_class = np.argmax(predictions, axis=1)
            //     predicted_label = label_encoder.inverse_transform(predicted_class)
            //     return predicted_label[0], predictions[0]

            // # Load model, tokenizer, and label encoder
            // model = load_model(model_url)
            // tokenizer = load_tokenizer(tokenizer_url)
            // label_encoder = load_label_encoder(label_encoder_url)

            // # Example text for prediction
            // input_text = "Your input text here"

            // if model and tokenizer and label_encoder:
            //     max_sequence_length = 100  # This should match the max_sequence_length used during training
            //     predicted_label, prediction_proba = make_predictions(input_text, model, tokenizer, label_encoder, max_sequence_length)
            //     print(f"Predicted label: {predicted_label}")
            //     print(f"Prediction probabilities: {prediction_proba}")
            // else:
            //     print("Failed to load model, tokenizer, or label encoder.")                    
            //                     `)
            //             }
            //             if (res.data.task === "image") {
            //                 setInterferenceCode(`
            // import requests
            // import tensorflow as tf
            // from tensorflow.keras.preprocessing import image
            // import numpy as np
            // import io

            // # URLs of the uploaded model
            // model_url = '${res.data.modelUrl}' # URL to the saved model

            // # Function to download the file from a URL
            // def download_file(url):
            //     response = requests.get(url)
            //     if response.status_code == 200:
            //         return response.content
            //     else:
            //         print(f"Failed to download {url}: {response.status_code}")
            //         return None

            // # Load the model
            // def load_model(url):
            //     model_content = download_file(url)
            //     if model_content:
            //         with open(model_url.split("/")[-1], 'wb') as f:
            //             f.write(model_content)
            //         model = tf.keras.models.load_model(model_url.split("/")[-1])
            //         return model
            //     return None

            // # Prepare the image for prediction
            // def prepare_image(image_path, img_height, img_width):
            //     img = image.load_img(image_path, target_size=(img_height, img_width))
            //     img_array = image.img_to_array(img)
            //     img_array = np.expand_dims(img_array, 0)  # Create batch axis
            //     img_array /= 255.0  # Normalize image
            //     return img_array

            // # Make predictions
            // def make_predictions(image_path, model, img_height, img_width):
            //     img_array = prepare_image(image_path, img_height, img_width)
            //     predictions = model.predict(img_array)
            //     class_idx = np.argmax(predictions, axis=1)[0]
            //     class_prob = predictions[0][class_idx]
            //     return class_idx, class_prob

            // # Load the model
            // model = load_model(model_url)

            // # Define the image path and image dimensions
            // image_path = 'path_to_your_image.jpg'  # Replace with your image path
            // img_height = 120
            // img_width = 120

            // if model:
            //     class_idx, class_prob = make_predictions(image_path, model, img_height, img_width)
            //     print(f"Predicted class index: {class_idx}")
            //     print(f"Class probability: {class_prob:.4f}")
            // else:
            //     print("Failed to load model.")
            //                     `)
            //             }
        }).catch(err => {
            console.log(err)
        })

        // try {
        //     const response = await fetch('https://api.xanderco.in/core/train/', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(trainingData),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     } else {
        //         console.log(response)
        //         console.log(response.body)
        //     }

        // } catch (error) {
        //     console.error('Error starting training:', error);
        //     setHasStarted(false);
        // }
    };

    useEffect(() => {
        const newSocket = new WebSocket(`wss://api.xanderco.in/ws/data/${userId}/`);

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
                    setProgress(progress => [...progress, data])
                }
                console.log(data)
                // ref.current.scrollIntoView({ behavior: 'smooth' });
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
                    <div className={styles.file__stuff}>
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
                                {/* <pre><code>
                                    {interferenceCode}
                                </code></pre> */}
                                <SyntaxHighlighter language="python" style={dracula}>
                                    {interferenceCode}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <div className={styles.container}>
                <div className={styles.task__details}>
                    <span className={styles.task__name}>{fileData.task_type.charAt(0).toUpperCase() + fileData.task_type.slice(1)}</span>
                    <span className={styles.arch__header}>Architecture</span>
                    <div className={styles.type__details}>
                        <span>Type: </span>
                        <div>{isMl ? "Machine Learning" : "Deep Learning"}</div>
                    </div>
                    <div className={styles.type__details}>
                        <span>Architecture Used: </span>
                        <div>{figureOutArch(architecture)}</div>
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
                                                    alert("Validation size can't be greater than 0.4")
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
                {!hasStarted && <div className={styles.start__training} onClick={() => handleStartTraining()}>Start Training</div>}
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
                            <div className={styles.copy__code} onClick={() => {
                                window.location.reload()
                            }}>Return Home</div>
                        </div>}
                    </div>
                }
            </div>
        </>
    )
}
