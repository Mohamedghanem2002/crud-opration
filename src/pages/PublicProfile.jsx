import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../../firebaseconfig";
import toast from "react-hot-toast";
import LoadingOverlay from "../components/loader";
import ProfileDetails from "../components/profile/ProfileDetails";
import { Link, useParams } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PublicProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        setUserData(null);
        return;
      }

      try {
        setLoading(true);
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData(null);
        }
      } catch (err) {
        toast.error(t("fetchError"));
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, t]);

  if (loading) return <LoadingOverlay />;

  if (!userData)
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white shadow rounded-2xl p-6 space-y-6 text-center">
            <p className="text-gray-500">{t("userNotFound")}</p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
              >
                {t("backHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckSquare className="text-blue-950" size={26} />
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-blue-950">
              {t("appName")}
            </h1>
          </div>

          {/* Profile details */}
          <ProfileDetails
            userData={userData}
            formData={{}}
            setFormData={() => {}}
            editMode={false}
            isPublic={true}
          />

          {/* CTA */}
          <div className="flex justify-center">
            <Link
              to="/auth/sign-up"
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
            >
              {t("joinUs")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
