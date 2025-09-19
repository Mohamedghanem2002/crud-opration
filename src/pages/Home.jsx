import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import TaskManagerLayout from "../components/Navbar/Navbar";

function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return <TaskManagerLayout />;
}

export default Home;
