import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtmTss54e8zrdDlEcf5i1_-pfSaPUWC1Q",
  authDomain: "mailbox-client-f5e39.firebaseapp.com",
  projectId: "mailbox-client-f5e39",
  storageBucket: "mailbox-client-f5e39.firebasestorage.app",
  messagingSenderId: "452096703215",
  appId: "1:452096703215:web:9c9c16b9fc3096d2af791a",
  measurementId: "G-NB8756NYGP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
