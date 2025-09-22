import { useParams, Navigate } from "react-router-dom";
import SignIn from "./../components/SignIn";
import SignUp from "./../components/SignUp";
import ForgotPassword from "./../components/ForgotPassword";
import { useTranslation } from "react-i18next";

function AuthPage() {
  const { type } = useParams();
  const { t } = useTranslation();

  if (type !== "sign-in" && type !== "sign-up" && type !== "forgot-password") {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">
        {type === "sign-in" && t("signIn")}
        {type === "sign-up" && t("signUp")}
        {type === "forgot-password" && t("forgotPassword")}
      </h1>

      {type === "sign-in" && <SignIn />}
      {type === "sign-up" && <SignUp />}
      {type === "forgot-password" && <ForgotPassword />}
    </div>
  );
}

export default AuthPage;
