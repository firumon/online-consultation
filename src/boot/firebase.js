import { initializeApp } from "firebase/app";
import { getFirestore,doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcRSq6K213Zn_64FKVfQP-GvGKqDlEykk",
  authDomain: "firumon-9abec.firebaseapp.com",
  projectId: "firumon-9abec",
  storageBucket: "firumon-9abec.appspot.com",
  messagingSenderId: "985218982992",
  appId: "1:985218982992:web:1f75ce0ab043e7c704dd55"
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const ROCRef = doc(firestore,'OnlineConsultation/Rafshina')

