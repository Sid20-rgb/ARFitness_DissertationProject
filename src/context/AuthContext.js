import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  //---------------------------------------
  // Google Login
  //---------------------------------------

  const loginWithGoogle = () => {
    return signInWithPopup(
      auth,
      googleProvider
    );
  };

  //---------------------------------------
  // Email Login
  //---------------------------------------

  const loginWithEmail = (
    email,
    password
  ) => {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  //---------------------------------------
  // Logout
  //---------------------------------------

  const logout = () => {
    return signOut(auth);
  };

  //---------------------------------------
  // Auth Listener
  //---------------------------------------

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithGoogle,
        loginWithEmail,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}