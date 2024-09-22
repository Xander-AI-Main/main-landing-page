import React, { useEffect, useState } from 'react'
import styles from '../css/pricing.module.css'
import tick from '../assets/a.svg'
import circles from '../assets/Frame 12.png'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signInWithEmailLink, isSignInWithEmailLink  } from "firebase/auth";
import { auth } from '../firebase/firebase'; 

export default function Pricing({ data }) {
    useEffect(() => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
  
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            console.log("User signed in:", result.user);
            window.localStorage.removeItem('emailForSignIn');
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error);
          });
      }
    }, []);

  const navigate = useNavigate()
  const checkouthandler = async (amount, plan, storage, cpu, gpu) => {
    try {
      const { data: { key } } = await axios.get("https://k4tvri7a15.execute-api.us-east-1.amazonaws.com/api/getkey");
      const { data: { order } } = await axios.post("https://k4tvri7a15.execute-api.us-east-1.amazonaws.com/api/checkout", {
        amount,
        notes: {
          address: "Xander Corporate Office",
          userId: localStorage.getItem("userId"),
          plan: plan,
          storage: storage,
          cpu: cpu,
          gpu: gpu
        }
      });

      const options = {
        key,
        "amount": order.amount,
        "currency": "USD",
        "name": "Xander Corp",
        "description": "Subscription Payment",
        "image": "https://res.cloudinary.com/ddvajyjou/image/upload/v1725183493/WhatsApp_Image_2024-07-28_at_14.46.39_241b7e61_y69biw.jpg",
        "order_id": order.id,
        "callback_url": "https://k4tvri7a15.execute-api.us-east-1.amazonaws.com/api/paymentVerification",
        "prefill": {
          "name": data.username ? data.username : "",
          "email": data.email ? data.email : "",
          "contact": data.phone_number ? data.phone_number : ""
        },
        "notes": {
          "address": "Xander Corporate Office",
          "userId": localStorage.getItem("userId"),
          "plan": plan,
          "storage": storage,
          "cpu": cpu,
          "gpu": gpu
        },
        "theme": {
          "color": "#231d3e"
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const [chosen, setChosen] = useState("")

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,  
      behavior: 'smooth'  
    });
  }, [chosen]);

  async function purhchase(plan, storage, cpu, gpu) {
    const purchase_date = new Date();
    let expired_date = new Date(purchase_date);
    expired_date.setMonth(purchase_date.getMonth() + 1);

    await axios.put('https://apiv3.xanderco.in/core/update/', {
      userId: localStorage.getItem("userId"),
      plan: plan,
      max_storage_allowed: storage,
      max_cpu_hours_allowed: cpu,
      max_gpu_hours_allowed: gpu,
      purchase_date: purchase_date,
      expired_date: expired_date
    }).then(res => {
      console.log(res.data)
      navigate('/main')
      window.location.reload()
    }).catch(err => {
      console.log(err)
    })
  }

  console.log(data)

  const handleSelectPlan = () => {
    if (chosen == "free") {
      if(data.plan === "free") {
        toast("You're already on the free trial!", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if(data.plan == "individual" || data.plan == "researcher" || data.plan == "basic" || data.plan == "standard" || data.plan == "pro"){
        toast("Can't downgrade the plan to the free trial!", {
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
        purhchase('free', 5, 5, 0)
      }
    } 
    else if(chosen == "individual") {
      checkouthandler(6, 'individual', 15, 15, 0)
    }
    else if(chosen == "researcher") {
      checkouthandler(12, 'researcher', 35, 35, 0)
    }
    else if(chosen == "basic") {
      checkouthandler(30, 'basic', 50, 75, 0)
    }
    else if(chosen == "standard") {
      checkouthandler(100, 'standard', 75, 0, 75)
    }
    else if(chosen == "pro") {
      checkouthandler(300, 'pro', 200, 0, 120)
    }
  }

  return (
    <div className={styles.contanier}>
      <div className={styles.navbar_} onClick={() => {
        if(data.plan !== "") {
          navigate('/main')
        }
      }}>Xander</div>
      <div className={styles.content}>
        <div className={styles.main__header}>
          Choose your plan
        </div>
        <div className={styles.underlying__text}>
          Unlock what fit your needs
        </div>
        <div className={styles.all__pricing}>
          <div className={styles.gradient}></div>
          <div className={styles.current__pricing} style={{ border: chosen === 'free' && '0.5px solid rgb(255 255 255)' }} onClick={() => {
            // purhchase('free', 5, 5, 0)
            setChosen('free')
          }}>
            <span className={styles.plan__title}>Free Trial</span>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>5 GB Storage</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>5 CPU Hours</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Regression</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Classification</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>All Textual Tasks</span>
            </div>
            <div className={styles.price__style}>
              <span className={styles.price__header}>Subscribe for</span>
              <div className={styles.main__price}>
                <span className={styles.price}>$0</span>
                <span className={styles.time}> / month</span>
              </div>
            </div>
          </div>
          <div className={styles.current__pricing} style={{ border: chosen === 'individual' && '0.5px solid rgb(255 255 255)' }} onClick={() => {
            // checkouthandler(6, 'individual', 15, 15, 0)
            setChosen('individual')
          }}>
            <span className={styles.plan__title}>Individual</span>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>15 GB Storage</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>15 CPU Hours</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Features in free trial</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Chatbot Creation</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" style={{ opacity: 0 }} />
              <span className={styles.details}></span>
            </div>
            <div className={styles.price__style}>
              <span className={styles.price__header}>Subscribe for</span>
              <div className={styles.main__price}>
                <span className={styles.price}>$6</span>
                <span className={styles.time}> / month</span>
              </div>
            </div>
          </div>
          <div className={styles.current__pricing} style={{ border: chosen === 'researcher' && '0.5px solid rgb(255 255 255)' }} onClick={() => {
            // checkouthandler(12, 'researcher', 35, 35, 0)
            setChosen('researcher')
          }}>
            <span className={styles.plan__title} >Researcher</span>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>35 GB Storage</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>35 CPU Hours</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Features in Individual</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Image Classification</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" style={{ opacity: 0 }} />
              <span className={styles.details}></span>
            </div>
            <div className={styles.price__style}>
              <span className={styles.price__header}>Subscribe for</span>
              <div className={styles.main__price}>
                <span className={styles.price}>$12</span>
                <span className={styles.time}> / month</span>
              </div>
            </div>
          </div>
          <div className={styles.current__pricing} style={{ border: chosen === 'basic' && '0.5px solid rgb(255 255 255)' }} onClick={() => {
            // checkouthandler(30, 'basic', 50, 75, 0)
            setChosen('basic')
          }}>
            <span className={styles.plan__title}>Basic</span>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>50 GB Storage</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>75 CPU Hours</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Features in Researcher</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Text to Speech</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" style={{ opacity: 0 }} />
              <span className={styles.details}></span>
            </div>
            <div className={styles.price__style}>
              <span className={styles.price__header}>Subscribe for</span>
              <div className={styles.main__price}>
                <span className={styles.price}>$30</span>
                <span className={styles.time}> / month</span>
              </div>
            </div>
          </div>
          <div className={styles.current__pricing} style={{ border: chosen === 'standard' && '0.5px solid rgb(255 255 255)' }} onClick={() => {
            // checkouthandler(100, 'standard', 75, 0, 75)
            setChosen('standard')
          }}>
            <span className={styles.plan__title}>Standard</span>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>75 GB Storage</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>75 GPU Hours</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>12 GB GPU RAM</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Features in Basic</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" style={{ opacity: 0 }} />
              <span className={styles.details}></span>
            </div>
            <div className={styles.price__style}>
              <span className={styles.price__header}>Subscribe for</span>
              <div className={styles.main__price}>
                <span className={styles.price}>$100</span>
                <span className={styles.time}> / month</span>
              </div>
            </div>
          </div>
          <div className={styles.current__pricing} style={{ border: chosen === 'pro' && '0.5px solid rgb(255 255 255)' }} onClick={() => {
            // checkouthandler(300, 'pro', 200, 0, 120)
            setChosen('pro')
          }}>
            <span className={styles.plan__title}>Professional</span>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>200 GB Storage</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>120 GPU Hours</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>12 GB GPU RAM</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" />
              <span className={styles.details}>Features in Standard</span>
            </div>
            <div className={styles.text}>
              <img src={tick} alt="" style={{ opacity: 0 }} />
              <span className={styles.details}></span>
            </div>
            <div className={styles.price__style}>
              <span className={styles.price__header}>Subscribe for</span>
              <div className={styles.main__price}>
                <span className={styles.price}>$300</span>
                <span className={styles.time}> / month</span>
              </div>
            </div>
          </div>
          <div className={styles.gradient__end}></div>
        </div>
        {chosen !== "" && <button className={styles.option__btn} onClick={handleSelectPlan}>Choose {chosen}</button>}
      </div>
    </div>
  )
}
