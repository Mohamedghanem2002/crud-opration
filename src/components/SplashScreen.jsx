import { useEffect, useState } from "react";
import { CheckSquare } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 800);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`flex items-center justify-center h-screen transition-opacity duration-700 
        ${fadeOut ? "opacity-0" : "opacity-100"} 
        bg-gradient-to-br from-blue-100 to-blue-300`}
    >
      <div className="text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-6 animate-bounce">
          <CheckSquare className="text-blue-950" size={70} />
          <h1 className="text-5xl font-extrabold tracking-wide text-blue-950">
            Task Manager
          </h1>
        </div>
        <h1 className="text-3xl font-bold animate-fadeIn text-gray-500">Welcome</h1>
        <p className="text-md mt-3 opacity-90 text-gray-500">Organize your tasks easily</p>
      </div>
    </div>
  );
}
