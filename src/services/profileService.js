// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../firebase";

// export async function saveUserProfile(userId, profile) {
//   await setDoc(doc(db, "users", userId), {
//     ...profile,
//     updatedAt: new Date().toISOString(),
//   });
// }

// export async function getUserProfile(userId) {
//   const snap = await getDoc(doc(db, "users", userId));

//   if (!snap.exists()) return null;

//   return snap.data();
// }