import firebase, { initializeApp } from "firebase/app"
import "firebase/firestore"

let firebaseConfig = {
  apiKey: "AIzaSyA2ygKDCMMG8wk1IZQAw-wpNWK_9xpI-LU",
  authDomain: "boardapp-363af.firebaseapp.com",
  projectId: "boardapp-363af",
  storageBucket: "boardapp-363af.appspot.com",
  messagingSenderId: "622216311979",
  appId: "1:622216311979:web:c32e62a6247a23c83833ee",
  measurementId: "G-QSKDE5HMJV"
};

// Initialize Firebase
if(!firebase.getApps.length) {
    const app = initializeApp(firebaseConfig);
}

export default firebase