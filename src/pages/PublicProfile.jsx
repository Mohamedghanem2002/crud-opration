import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../../firebaseconfig";
import toast from "react-hot-toast";
import LoadingOverlay from "../components/loader";
import ProfileDetails from "../components/profile/ProfileDetails";
import { Link, useParams } from "react-router-dom";
import { CheckSquare } from "lucide-react";

export default function PublicProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

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
        toast.error("Error fetching public profile:", err);
        setUserData(null);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <LoadingOverlay />;
  if (!userData) return(
  <div className="h-screen flex justify-center items-center">
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-6 space-y-6">
        <p className="text-center text-gray-500">User not found</p>
        <div className="flex gap-4 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-auto">
            <Link to="/">Back Home</Link>
          </button>
        </div>
      </div>
    </div>
  </div>
  );

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-center gap-1 mb-6">
              <CheckSquare className="text-blue-950" size={24} />
              <h1 className="text-xl font-extrabold tracking-wide text-blue-950">
                Task Manager
              </h1>
            </div>
            <ProfileDetails
              userData={userData}
              formData={{}}
              setFormData={() => {}}
              editMode={false}
              isPublic={true}
            />
            <div className="flex gap-4 mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-auto">
                <Link to="/auth/sign-up">Join Us</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
