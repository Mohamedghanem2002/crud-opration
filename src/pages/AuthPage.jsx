import { useParams, Navigate } from "react-router-dom";
import SignIn from "./../components/SignIn";
import SignUp from "./../components/SignUp";
import ForgotPassword from "./../components/ForgotPassword";

function AuthPage() {
  const { type } = useParams();

  if (type !== "sign-in" && type !== "sign-up" && type !== "forgot-password") {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {type === "sign-in" && <SignIn />}
      {type === "sign-up" && <SignUp />}
      {type === "forgot-password" && <ForgotPassword />}
    </div>
  );
}

export default AuthPage;
