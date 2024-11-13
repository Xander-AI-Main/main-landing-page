import React, { useEffect, useRef, useState } from "react";
import styles from "../css/login.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";
import ReactFlagsSelect from "react-flags-select";
import { useCountries } from "use-react-countries";
import { Dropdown } from "react-bootstrap";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import loadingBot from "../assets/loading_bot.svg";
import face1 from "../assets/face1.png";
import face2 from "../assets/face2.png";
import face3 from "../assets/face3.png";
import { urls } from "../constants/constants";
import upload from "../assets/Upload.svg";

export default function Signup() {
  const navigate = useNavigate();
  const [phNum, setPhNum] = useState("");
  const { countries } = useCountries();
  const [countryCode, setCountryCode] = useState("+91");
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(0);
  const [datasetUrl, setDatasetUrl] = useState("");
  const [archType, setArchType] = useState("default");
  const [mainType, setMainType] = useState("DL");
  const [progress, setProgress] = useState([]);
  const [finalModel, setFinalModel] = useState(null);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [architecture, setArchitecture] = useState([]);
  const [hyperparameters, setHyperparameters] = useState({});
  const [socket, setSocket] = useState(null);
  const [currentEpoch, setCurrentEpoch] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 6000);
    return () => clearTimeout(timer);
  }, []);

  const sendLoginLink = (email) => {
    let actionCodeSettings = {
      url: "https://platform.xanderco.in/pricing",
      handleCodeInApp: true,
    };
    if (
      searchParams.get("cameFrom") &&
      searchParams.get("cameFrom") == "contest"
    ) {
      actionCodeSettings = {
        url: "https://platform.xanderco.in/contests",
        handleCodeInApp: true,
      };
    } else {
      actionCodeSettings = {
        url: "https://platform.xanderco.in/pricing",
        handleCodeInApp: true,
      };
    }

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        navigate("/confirmation");
      })
      .catch((error) => {
        console.error("Error sending email verification link:", error);
      });
  };

  const returnFlag = (code) => {
    countries?.map((item) => {
      if (item.countryCallingCode === code) {
        return item?.flags?.svg;
      }
    });
  };

  const [selected, setSelected] = useState({
    code: "+91",
    flag: returnFlag("+91"),
  });

  const findFlag = (code) => {
    countries?.map((item) => {
      if (item.countryCallingCode === code) {
        setSelected({ code: code, flag: item?.flags?.svg });
      }
    });
  };

  useEffect(() => {
    findFlag(countryCode);
  }, [countryCode]);

  const [futureDate, setFutureDate] = useState(new Date());
  const future = new Date();
  future.setDate(future.getDate() + 30);

  const [details, setDetails] = useState({
    email: "",
    password: "",
    username: "",
    phone_number: "",
    plan: "",
    max_storage_allowed: 0,
    max_cpu_hours_allowed: 0,
    max_gpu_hours_allowed: 0,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [started, setStarted] = useState(false);
  const [searchParams] = useSearchParams();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User logged in:", user);
      toast.success(`Welcome, ${user.displayName}`);
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("Google login failed");
    }
  };

  async function signup() {
    if (
      details.email === "" ||
      details.password === "" ||
      details.username === "" ||
      details.phone_number === ""
    ) {
      toast("Please fill all the fields", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      if (!emailRegex.test(details.email)) {
        toast("Invalid Email Address", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        setStarted(true);
        let arr = { ...details };
        arr["phone_number"] = selected.code + arr["phone_number"];
        await axios
          .post("https://apiv3.xanderco.in/core/signup/signup//", arr)
          .then((res) => {
            console.log(res.data);

            localStorage.setItem("userId", res.data.userId);
            sendLoginLink(details.email);
            setDetails({
              email: "",
              password: "",
              username: "",
              phone_number: "",
              plan: "",
              max_storage_allowed: 0,
              max_cpu_hours_allowed: 0,
              max_gpu_hours_allowed: 0,
            });
            setStarted(false);
          })
          .catch((err) => {
            console.log(err);
            setStarted(false);
            toast("User already exists!", {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      }
    }
  }

  async function download(item) {
    const response = await axios.get(item, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", item.split("/")[item.split("/").length - 1]);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function uploadFile(e) {
    setStep(5);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "84");

    await axios
      .post("https://apiv3.xanderco.in/core/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        handleStartTraining(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleStartTraining = async (fileData) => {
    setHasStarted(true);
    const trainingData = {
      dataset_url: fileData.cloud_url,
      hasChanged: false,
      task: fileData.task_type,
      mainType: mainType,
      archType: archType,
      userId: "84",
      hyperparameters: fileData.hyperparameter,
    };

    await axios
      .post("https://apiv3.xanderco.in/core/train/", trainingData)
      .then((res) => {
        console.log(res.data);
        setFinalModel(res.data);
        setProgress(res.data.epoch_data ? res.data.epoch_data : []);
        setHasEnded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const newSocket = new WebSocket(`wss://apiv3.xanderco.in/ws/data/84/`);

    setSocket(newSocket);

    if (newSocket) {
      newSocket.onopen = () => {
        console.log("WebnewSocket connection established");
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.modelUrl) {
          setHasEnded(true);
          setFinalModel(data);
        } else {
          setCurrentEpoch(parseInt(data.epoch));
          setProgress((progress) => [...progress, data]);
        }
        console.log(data);
        if (document.getElementById("scroll")) {
          document
            .getElementById("scroll")
            .scrollBy({
              top: document.getElementById("scroll").scrollTop + 30,
            });
        }
      };

      newSocket.onclose = () => {
        console.log("WebnewSocket connection closed");
      };

      return () => {
        newSocket.close();
      };
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.navbar__content}>
        <span>Xander</span>
      </div>
      {step === 0 && (
        <div className={styles.loading__main}>
          <div className={styles.top}>
            <img src={loadingBot} alt="" />
            <div className={styles.loading_bar}>
              <div className={styles.progress}></div>
            </div>
            <div className={styles.blur}></div>
            <span>
              Do You Know that training large language models (LLMs) like GPT
              involves processing massive datasets using high-performance
              hardware, such as GPUs or TPUs, to fine-tune billions of
              parameters.
            </span>
            <div
              className={styles.login}
              onClick={() => {
                navigate("/login");
              }}
            >
              <span className={styles.first}>Already have an account?</span>
              <span className={styles.second}>Log in</span>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={styles.understanding__main}>
          <div className={styles.um__sub}>
            <div className={styles.um__top}>
              <img src={loadingBot} alt="" />
              <span>SELECT LEVEL OF UNDERSTANDING</span>
              <div className={styles.separator}></div>
              <div className={styles.blur}></div>
              <div className={styles.faces}>
                <div
                  className={styles.box}
                  style={{ marginRight: "4.5rem" }}
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  <img src={face1} alt="" />
                  <span>Newbie</span>
                </div>
                <div
                  className={styles.box}
                  style={{ marginRight: "4.5rem" }}
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  <img src={face2} alt="" />
                  <span>Intermediate</span>
                </div>
                <div
                  className={styles.box}
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  <img src={face3} alt="" />
                  <span>Advanced</span>
                </div>
              </div>
            </div>
            <div
              className={styles.login}
              style={{
                top: "9rem",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              <span className={styles.first}>Already have an account?</span>
              <span className={styles.second}>Log in</span>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className={styles.understanding__main}>
          <div className={styles.um__sub}>
            <div className={styles.um__top}>
              <img src={loadingBot} alt="" />
              <span>For what purpose do you want to use xander ?</span>
              <div className={styles.separator}></div>
              <div className={styles.blur}></div>
              <div className={styles.faces}>
                <div
                  className={styles.box}
                  style={{ marginRight: "4.5rem" }}
                  onClick={() => {
                    setStep(3);
                  }}
                >
                  <span>Personal</span>
                </div>
                <div
                  className={styles.box}
                  style={{ marginRight: "4.5rem" }}
                  onClick={() => {
                    setStep(3);
                  }}
                >
                  <span>Business</span>
                </div>
                <div
                  className={styles.box}
                  onClick={() => {
                    setStep(3);
                  }}
                >
                  <span>Other</span>
                </div>
              </div>
            </div>
            <div
              className={styles.login}
              style={{
                top: "9rem",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              <span className={styles.first}>Already have an account?</span>
              <span className={styles.second}>Log in</span>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div
          className={styles.understanding__main}
          style={{ marginTop: "-1rem" }}
        >
          <div className={styles.um__sub}>
            <div className={styles.um__top}>
              <img src={loadingBot} alt="" />
              <span>
                That's it for the questions! Choose a dataset & let's get
                training
              </span>
              <div className={styles.separator}></div>
              <div className={styles.blur}></div>
              <div className={styles.datasets}>
                <div
                  className={styles.dataset__box}
                  style={{ marginRight: "4.5rem" }}
                  onClick={() => {
                    setStep(4);
                  }}
                >
                  <span className={styles.d__header}>Classification</span>
                  <span className={styles.d__description}>
                    This dataset supports sonar detection system development,
                    classifying data into two classes: 0 (no detection) and 1
                    (detection).
                  </span>
                  <div
                    className={styles.d__download}
                    onClick={() => {
                      download(urls["classification"]);
                      setStep(4);
                    }}
                  >
                    Download
                  </div>
                </div>
                <div
                  className={styles.dataset__box}
                  style={{}}
                  onClick={() => {
                  }}
                >
                  <span className={styles.d__header}>Regression</span>
                  <span className={styles.d__description}>
                    This dataset analyzes factors such as age, BMI, and smoking
                    status to predict a particular individuals' medical
                    insurance costs.
                  </span>
                  <div
                    className={styles.d__download}
                    onClick={() => {
                      download(urls["regression"]);
                    setStep(4);
                    }}
                  >
                    Download
                  </div>
                </div>
                <div
                  className={styles.dataset__box}
                  style={{ marginRight: "4.5rem", marginTop: "2rem" }}
                  onClick={() => {
                  }}
                >
                  <span className={styles.d__header}>Image Classification</span>
                  <span className={styles.d__description}>
                    This dataset consists of images of various breeds of dogs
                    and cats, aiming to create a classification system for
                    classification between dogs and cats.
                  </span>
                  <div
                    className={styles.d__download}
                    onClick={() => {
                      download(urls["image"]);
                      setStep(4)                    
                      }}
                  >
                    Download
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div
          className={styles.understanding__main}
          style={{ marginTop: "-1rem" }}
        >
          <div className={styles.um__sub}>
            <div className={styles.um__top}>
              <img src={loadingBot} alt="" />
              <span>Almost There! Unlock Your No-Code AI Model</span>
              <div className={styles.separator}></div>
              <div className={styles.blur}></div>
              <div className={styles.u__header}>
                Upload the dataset you just downloaded!
              </div>
              <div className={styles.mainService1} onClick={() => {}}>
                <label className={styles.uploadLabel1}>
                  <div className={styles.subService}>
                    <div className={styles.choose1}>
                      <div className={styles.upload__icon1}>
                        <img src={upload} alt="" />
                      </div>
                      <span className={styles.info1}>Upload Dataset</span>
                      <input
                        type="file"
                        className={styles.hiddenInput}
                        accept=".zip,.csv,.json,.pdf"
                        onChange={(e) => {
                          uploadFile(e);
                        }}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 5 && (
        <div
          className={styles.understanding__main}
          style={{ marginTop: "-1rem" }}
        >
          <div className={styles.um__sub}>
            <div className={styles.um__top}>
              <img src={loadingBot} alt="" />
              <span>Let's get training!</span>
              <div className={styles.separator}></div>
              <div className={styles.blur}></div>
              <div className={styles.u__header}>
                {!hasStarted
                  ? "Your dataset is uploading..."
                  : "The training has begun!"}
              </div>
              {hasStarted && (
                <div className={styles.training__data} ref={ref} id="scroll">
                  {progress.map((item, index) => {
                    return (
                      <div className={styles.current__train__info}>
                        <span>Epoch: {item.epoch}</span>
                        <div>
                          {item.train_acc &&
                            "Train Accuracy: " +
                              (item.train_acc * 100).toFixed(2).toString() +
                              "%"}{" "}
                          {item.train_loss &&
                            "Train Loss: " +
                              item.train_loss.toFixed(2).toString()}{" "}
                          {item.test_loss &&
                            "Test Loss: " +
                              item.test_loss.toFixed(2).toString()}{" "}
                          {item.test_acc &&
                            "Test Accuracy: " +
                              (item.test_acc * 100).toFixed(2).toString() +
                              "%"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {hasEnded && (
                <div className={styles.training__btns}>
                  {!finalModel?.datasetUrl?.includes("pdf") && (
                    <div
                      className={styles.download__model}
                      onClick={() => {
                        download(finalModel?.modelUrl);
                      }}
                    >
                      Download Model
                    </div>
                    
                  )}
                   <div
                      className={styles.signup__btn}
                      onClick={() => {
                        setStep(6)
                      }}
                    >
                      Signup
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {step === 6 && (
        <div className={styles.main}>
          <div className={styles.details}>
            <div className={styles.texts}>
              <span className={styles.welcome__text}>Get Started</span>
              <div
                className={styles.question}
                onClick={() => {
                  if (
                    searchParams.get("cameFrom") &&
                    searchParams.get("cameFrom") == "contest"
                  ) {
                    navigate("/login?cameFrom=contest");
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <span className={styles.first}>Already have an account?</span>
                <span className={styles.second}>Log in</span>
              </div>
            </div>
            <div className={styles.inputs}>
              <div className={styles.email}>
                <span className={styles.email__header}>Email</span>
                <input
                  className={styles.detail__input}
                  type="text"
                  placeholder="Enter you email"
                  value={details.email}
                  onChange={(e) => {
                    setDetails({ ...details, email: e.target.value });
                  }}
                />
              </div>
              <div className={styles.phNum}>
                <Dropdown
                  className={styles.phDrop}
                  style={{
                    position: "absolute",
                    background: "none",
                    right: "auto",
                    boxShadow: "none",
                    textAlign: "unset",
                    width: "max-content",
                    padding: "0rem",
                  }}
                  autoClose="outside inside"
                >
                  <Dropdown.Toggle
                    style={{
                      background: "none",
                      padding: "0",
                      margin: 0,
                      border: "0px solid",
                    }}
                    className={styles.phToggle}
                  >
                    <Dropdown.Header style={{ cursor: "pointer" }}>
                      <img
                        src={selected?.flag}
                        alt=""
                        style={{ width: "28px", marginRight: "0.15rem" }}
                      />
                      {/* <span>{selected?.code}</span> */}
                    </Dropdown.Header>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{ height: "10rem", overflowY: "scroll" }}
                    className={styles.phMenu}
                  >
                    <input
                      className={styles.detail__input__country}
                      type="text"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                    {countries &&
                      countries?.length > 0 &&
                      countries
                        ?.filter((elem) => {
                          return elem?.name
                            ?.toLowerCase()
                            ?.includes(search.toLowerCase());
                        })
                        .map((item) => {
                          return (
                            item.countryCallingCode !== "" && (
                              <Dropdown.Item
                                className={styles.phItem}
                                onClick={() => {
                                  setSelected({
                                    code: item.countryCallingCode,
                                    flag: item.flags.svg,
                                  });
                                }}
                              >
                                <img
                                  src={item.flags.svg}
                                  alt=""
                                  style={{ width: "28px" }}
                                />{" "}
                                {item.countryCallingCode} {" - "}{" "}
                                {item?.name ? item?.name : ""}
                              </Dropdown.Item>
                            )
                          );
                        })}
                  </Dropdown.Menu>
                </Dropdown>
                <div className={styles.phEmail}>
                  <span className={styles.phone__number__header}>
                    Phone Number
                  </span>
                  <input
                    className={styles.detail__input_ph}
                    type="text"
                    placeholder="Enter your phone number"
                    value={details.phone_number}
                    onChange={(e) => {
                      setDetails({ ...details, phone_number: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div className={styles.email}>
                <span className={styles.username__header}>Username</span>
                <input
                  className={styles.detail__input}
                  type="text"
                  placeholder="Enter your username"
                  value={details.username}
                  onChange={(e) => {
                    setDetails({ ...details, username: e.target.value });
                  }}
                />
              </div>

              <div className={styles.email}>
                <span className={styles.password__header}>Password</span>
                <input
                  className={styles.detail__input}
                  type="password"
                  placeholder="Enter your password"
                  value={details.password}
                  onChange={(e) => {
                    setDetails({ ...details, password: e.target.value });
                  }}
                />
              </div>
              <div
                className={styles.login__btn}
                style={{
                  padding: started
                    ? "0.4rem 0.8rem 0.4rem 0.8rem"
                    : "0.8rem 0.8rem 0.9rem 0.8rem",
                }}
                onClick={() => {
                  signup();
                }}
              >
                {!started ? (
                  "Sign Up"
                ) : (
                  <ColorRing
                    visible={true}
                    height="40"
                    width="40"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
                  />
                )}
              </div>
              {/* <button onClick={handleGoogleLogin}>Sign in with Google</button> */}
            </div>
          </div>
          <div className={styles.gradient__bg}></div>
          <div className={styles.boxes}>
            <div className={styles.box1}></div>
            <div className={styles.box2}></div>
            <div className={styles.box3}></div>
            <div className={styles.box4}></div>
          </div>
        </div>
      )}
    </div>
  );
}
