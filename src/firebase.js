import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCroNUlYu38bys_BnvWnUMnjjO4RaTAQ7I",
  authDomain: "ar-fitness-e2be9.firebaseapp.com",
  projectId: "ar-fitness-e2be9",
  storageBucket: "ar-fitness-e2be9.firebasestorage.app",
  messagingSenderId: "806696000439",
  appId: "1:806696000439:web:010f5bab9810c2115aa632",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// export const db = getFirestore(app);