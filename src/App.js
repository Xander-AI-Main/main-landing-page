import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Pricing from "./components/Pricing";
import MainLandingPage from "./components/MainLandingPage";
import Profile from "./components/Profile";
import Layout from "../src/Layout";
import Models from "./components/Models";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Datasets from "./components/Datasets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Favicon from "react-favicon";
import icon from "../src/assets/image.png";
import { useSelector } from "react-redux";
import Contests from "./components/Contests";

function App() {
  const [data, setData] = useState({});
  const { reFetchModel } = useSelector((state) => state.noPersistXanderSlice);

  async function getUsers() {
    await axios
      .get(
        `https://api.xanderco.in/core/update/?userId=${localStorage.getItem(
          "userId"
        )}`
      )
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
  console.log(reFetchModel)

  useEffect(() => {
    if (reFetchModel == true) {
      getUsers();
    }
  }, [reFetchModel]);

  return (
    <Router>
      <AppContent data={data} />
    </Router>
  );
}

const AppContent = ({ data }) => {
  const location = useLocation();
  const noLayoutPaths = ["/signup", "/login", "/pricing", "/", "/contests"];
  const useLayout = !noLayoutPaths.includes(location.pathname);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userId") && !window.location.href.includes("contests")) {
      // navigate("/");
    }
  }, []);

  return (
    <div>
      <Favicon url={icon} />
      {useLayout ? (
        <Layout data={data}>
          <Routes>
            <Route path="/main" element={<MainLandingPage data={data} />} />
            <Route path="/profile" element={<Profile data={data} />} />
            <Route path="/models" element={<Models data={data} />} />
            <Route path="/datasets" element={<Datasets data={data} />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing data={data}/>} />
          <Route path="/contests" element={<Contests />} />
        </Routes>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
