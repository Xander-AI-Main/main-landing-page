import React, { useEffect, useState } from 'react'
import styles from '../css/login.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ColorRing } from 'react-loader-spinner'
import ReactFlagsSelect from "react-flags-select";
import { useCountries } from "use-react-countries";
import { Dropdown } from 'react-bootstrap'

export default function Signup() {
  const navigate = useNavigate()
  const [phNum, setPhNum] = useState("");
  const { countries } = useCountries();
  const [countryCode, setCountryCode] = useState("+91");
  const [search, setSearch] = useState("")

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
    email: '',
    password: '',
    username: '',
    phone_number: '',
    plan: 'free',
    max_storage_allowed: 5,
    max_cpu_hours_allowed: 5,
    max_gpu_hours_allowed: 0,
    // purchase_date: new Date(),
    // has_expired: false,
    // expired_date: future
  })
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [started, setStarted] = useState(false)
  const [searchParams] = useSearchParams();

  // console.log(searchParams.get('cameFrom'))

  async function signup() {
    if (details.email === "" || details.password === "" || details.username === "" || details.phone_number === "") {
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
        setStarted(true)
        let arr = {...details}
        arr["phone_number"] = selected.code + arr["phone_number"]
        await axios.post("https://api.xanderco.in/core/signup/signup//", arr).then(res => {
          console.log(res.data)
          setDetails({
            email: '',
            password: '',
            username: '',
            phone_number: '',
            // plan: 'free',
            // max_storage_allowed: 5,
            // max_cpu_hours_allowed: 5,
            // max_gpu_hours_allowed: 0
          })
          localStorage.setItem("userId", res.data.userId)
          if(searchParams.get('cameFrom') && searchParams.get('cameFrom') == "contest") {
            navigate('/contests')
          } else {
            navigate("/pricing")
          }
          window.location.reload()
          setStarted(false)
        }).catch(err => {
          console.log(err)
          setStarted(false)
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
        })
      }
    }
  }

  console.log(countries)

  return (
    <div className={styles.container}>
      <div className={styles.navbar__content}>
        <span>Xander</span>
      </div>
      <div className={styles.main}>
        <div className={styles.details}>
          <div className={styles.texts}>
            <span className={styles.welcome__text}>Get Started</span>
            <div className={styles.question} onClick={() => {
              if(searchParams.get('cameFrom') && searchParams.get('cameFrom') == "contest") {
                navigate('/login?cameFrom=contest')
              } else {
                navigate("/login")
              }
            }}>
              <span className={styles.first}>Already have an account?</span>
              <span className={styles.second}>Log in</span>
            </div>
          </div>
          <div className={styles.inputs}>
            <div className={styles.email}>
              <span className={styles.email__header}>Email</span>
              <input className={styles.detail__input} type="text" placeholder="Enter you email" value={details.email} onChange={(e) => {
                setDetails({ ...details, email: e.target.value })
              }} />
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
                      style={{ width: "28px", marginRight: '0.15rem' }}
                    />
                    {/* <span>{selected?.code}</span> */}
                  </Dropdown.Header>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{ height: "10rem", overflowY: "scroll" }}
                  className={styles.phMenu}
                >
                  <input className={styles.detail__input__country} type="text" placeholder="Search" value={search} onChange={(e) => {
                  setSearch(e.target.value)
                }} />
                  {countries && countries?.length > 0 && countries?.filter((elem) => {
                    return elem?.name?.toLowerCase()?.includes(search.toLowerCase())
                  }).map((item) => {
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
                          <img src={item.flags.svg} alt="" style={{ width: '28px' }} /> {item.countryCallingCode} {' - '} {item?.name ? item?.name : ''}
                        </Dropdown.Item>
                      )
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              <div className={styles.phEmail}>
                <span className={styles.phone__number__header}>Phone Number</span>
                <input className={styles.detail__input_ph} type="text" placeholder="Enter your phone number" value={details.phone_number} onChange={(e) => {
                  setDetails({ ...details, phone_number: e.target.value })
                }} />
              </div>
            </div>
            <div className={styles.email}>
              <span className={styles.username__header}>Username</span>
              <input className={styles.detail__input} type="text" placeholder="Enter your username" value={details.username} onChange={(e) => {
                setDetails({ ...details, username: e.target.value })
              }} />
            </div>

            <div className={styles.email}>
              <span className={styles.password__header}>Password</span>
              <input className={styles.detail__input} type="password" placeholder="Enter your password" value={details.password} onChange={(e) => {
                setDetails({ ...details, password: e.target.value })
              }} />
            </div>
            <div className={styles.login__btn} style={{ padding: started ? '0.4rem 0.8rem 0.4rem 0.8rem' : '0.8rem 0.8rem 0.9rem 0.8rem' }} onClick={() => {
              signup()
            }}>
              {!started ? 'Sign Up' : <ColorRing
                visible={true}
                height="40"
                width="40"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
              />}
            </div>
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
    </div>
  )
}
