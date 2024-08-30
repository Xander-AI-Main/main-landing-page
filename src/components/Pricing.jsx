import React, { useState } from 'react'
import styles from '../css/pricing.module.css'
import tick from '../assets/a.svg'
import circles from '../assets/Frame 12.png'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()
  
  const checkouthandler = async (amount , plan, storage, cpu, gpu) => {
    try {
      const {data : {key}} = await axios.get("http://localhost:4000/api/getkey")
      const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
        amount,
      });
  
      const options = {
       
        key, 
        "amount": order.amount, 
        "currency": "USD",
        "name": "Xander Corp", 
        "description": "Subscription Payment",
        "image": "https://example.com/your_logo",
        "order_id": order.id, 
        "callback_url": "http://localhost:4000/api/paymentVerification",
        "prefill": {
          "name": "Atulit Gaur", 
          "email": "atulitpookie@gmail.com",
          "contact": "9000090000" 
        },
        "notes": {
          "address": "Xander Corporate Office"
        },
        "theme": {
          "color": "#231d3e"
        }
      };
  
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  async function purhchase(plan, storage, cpu, gpu) {
    await axios.put('https://api.xanderco.in/core/update/', {
      userId: localStorage.getItem("userId"),
      plan: plan,
      max_storage_allowed: storage,
      max_cpu_hours_allowed: cpu,
      max_gpu_hours_allowed: gpu
    }).then(res => {
      console.log(res.data)
      navigate('/main')
      window.location.reload()
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className={styles.contanier}>
      <div className={styles.content}>
        <div className={styles.main__header}>
          Choose your plan
        </div>
        <div className={styles.underlying__text}>
          Unlock what fit your needs
        </div>
        <div className={styles.all__pricing}>
          <div className={styles.gradient}></div>
          <div className={styles.current__pricing} onClick={() => {
            purhchase('free', 5, 5, 0)
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
          <div className={styles.current__pricing} onClick={() => {
           checkouthandler(6)
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
          <div className={styles.current__pricing} onClick={() => {
            checkouthandler(12)
          }}>
            <span className={styles.plan__title}>Researcher</span>
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
          <div className={styles.current__pricing} onClick={() => {
            checkouthandler(30)
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
          <div className={styles.current__pricing} onClick={() => {
            checkouthandler(100)
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
          <div className={styles.current__pricing} onClick={() => {
            checkouthandler(300)
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
      </div>
    </div>
  )
}
