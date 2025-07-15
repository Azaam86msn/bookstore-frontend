// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";

const AuthContext = createContext();

// Custom hook to access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // Login a user
  const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  // Logout the user and remove the stored token
  const logout = () => {
    localStorage.removeItem("token");
    return signOut(auth);
  };

  // Manage authentication state using onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken(true)
          .then((idToken) => {
            localStorage.setItem("token", idToken);
            console.log("Firebase token stored:", idToken);
          })
          .catch((err) => {
            console.error("Error getting token:", err);
          });
      } else {
        localStorage.removeItem("token");
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  }), [
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
