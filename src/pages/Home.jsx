import { useState } from "react";
import SplashScreen from "../components/SplashScreen";
import { Navigate } from "react-router-dom";

function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </>
  );
}

export default Home;
