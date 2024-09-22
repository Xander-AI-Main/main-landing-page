import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZZ82LCLkuOz4a3L55dRfHBUdvahZJtpU",
  authDomain: "xander-90f45.firebaseapp.com",
  projectId: "xander-90f45",
  storageBucket: "xander-90f45.appspot.com",
  messagingSenderId: "476020052333",
  appId: "1:476020052333:web:4629242e51d59b3ed7ca64",
  measurementId: "G-YE4LBD8V2J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);