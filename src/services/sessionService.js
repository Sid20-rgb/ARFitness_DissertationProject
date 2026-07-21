// import {
//   addDoc,
//   collection,
//   getDocs,
//   orderBy,
//   query,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase";

// export async function saveWorkoutSession(userId, session) {
//   await addDoc(collection(db, "users", userId, "sessions"), {
//     ...session,
//     createdAt: serverTimestamp(),
//   });
// }

// export async function getWorkoutSessions(userId) {
//   const q = query(
//     collection(db, "users", userId, "sessions"),
//     orderBy("createdAt", "asc")
//   );

//   const snap = await getDocs(q);

//   return snap.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// }