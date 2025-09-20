import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingOverlay from "./loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay/>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
