import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./../../firebaseconfig";
import { useNavigate, Outlet } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";
import TaskManagerLayout from "../components/Navbar";
import Loader from "./../components/loader";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);

        if (!currentUser) {
          navigate("/auth/sign-in");
        }
      });

      return () => unsubscribe();
    }
  }, [showSplash, navigate]);

  if (showSplash) return <SplashScreen />;

  if (checkingAuth) return <Loader />;

  if (user) {
    return (
      <TaskManagerLayout>
        <Outlet />
      </TaskManagerLayout>
    );
  }

  return null;
}
