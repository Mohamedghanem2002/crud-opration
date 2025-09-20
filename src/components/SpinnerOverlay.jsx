import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export function SpinnerOverlay({ loading }) { 
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-[9999]">
      <ClipLoader loading={loading} size={50} />
    </div>
  );
}

export default function PageLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <SpinnerOverlay loading={loading} />
      {children}
    </>
  );
}
