const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const serviceAccount = require("./permissions.json");

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const app = initializeApp(serviceAccount);
const db = getFirestore(app);

module.exports = db;

// export {db}
