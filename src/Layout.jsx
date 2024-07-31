import React, { useState } from 'react';
import styles from "../src/css/app.module.css";
import Sidebar from "./components/Sidebar";
import wave from "../src/assets/wave.png";
import Navbar from "./components/Navbar";

export default function Layout({ children, data }) {
  const [collapsed, setCollapsed] = useState(false);

  const changeCollapsed = (data) => {
    setCollapsed(data);
  };

  return (
    <div className={styles.container}>
      <Sidebar data={data} changeCollapsed={changeCollapsed} prevCollpased={collapsed} />
      <div className={styles.background__style}></div>
      <div className={styles.bg__wave}>
        <img src={wave} alt="wave" />
      </div>
      <div className={styles.content} style={{ width: collapsed ? "83%" : "95%" }}>
        <Navbar data={data} collapsed={collapsed} />
        {React.Children.map(children, child =>
          React.cloneElement(child, { collapsed })
        )}
      </div>
    </div>
  );
}
