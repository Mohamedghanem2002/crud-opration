import { useEffect, useState } from "react";
import { auth, db } from "./../../firebaseconfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import LoadingOverlay from "../components/loader";
import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import toast from "react-hot-toast";
import { isValidPhoneNumber } from "libphonenumber-js";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          await setDoc(docRef, {
            name: user.displayName || "",
            email: user.email,
            phones: user.phoneNumber ? [user.phoneNumber] : [],
            bio: "",
            role: "",
            dob: "",
            location: "",
            links: [],
            memberSince: user.memberSince,
            lastLogin: new Date().toISOString(),
            completedTasks: user.completedTasks,
            pendingTasks: user.pendingTasks,
            projectsCount: user.projectsCount,
          });
          const newSnap = await getDoc(docRef);
          setUserData(newSnap.data());
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updates
  const handleSave = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);

      let cleanedPhones = (formData.phones || []).filter(
        (p) => p.trim() !== "" && /^[0-9]+$/.test(p)
      );

      const validatePhones = (phones) => {
        return phones.every((phone) => isValidPhoneNumber(phone));
      };

      if (!validatePhones(formData.phones)) {
        return toast.error("Invalid phone number format.");
      }

      if (cleanedPhones.length === 0) {
        toast.error("Please enter at least one valid phone number.");
        return;
      }

      let cleanedLinks = (formData.links || []).filter(
        (link) => link.trim() !== "" && /^https?:\/\/.+/.test(link)
      );

      await updateDoc(userRef, {
        ...formData,
        phones: cleanedPhones,
        links: cleanedLinks,
        lastLogin: new Date().toISOString(),
      });

      setUserData({
        ...userData,
        ...formData,
        phones: cleanedPhones,
        links: cleanedLinks,
      });
      setEditMode(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-6 space-y-6">
        {/* User Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">User Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-gray-600">Name</label>
              {editMode ? (
                <p className="bg-gray-100 p-2 rounded">
                  {formData.name || userData.name}
                </p>
              ) : (
                <p className="p-2 rounded">{formData.name || userData.name}</p>
              )}
            </div>
            <div>
              {editMode ? (
                <>
                  <label className="block text-gray-600">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || userData.dob || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </>
              ) : (
                userData.dob && (
                  <>
                    <label className="block text-gray-600">Date of Birth</label>
                    <p>{userData.dob}</p>
                  </>
                )
              )}
            </div>

            <div>
              {editMode ? (
                <>
                  <label className="block text-gray-600">Location</label>
                  <input
                    name="location"
                    value={formData.location || userData.location || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </>
              ) : (
                <>
                  <label className="block text-gray-600">Location</label>
                  {userData.location && <p>{userData.location}</p>}
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold my-2">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-gray-600">Email</label>
                {editMode ? (
                  <p className="bg-gray-100 p-2 rounded">{userData.email}</p>
                ) : (
                  <p className="p-2 rounded">{userData.email}</p>
                )}
              </div>

              {/* Phones */}
              <div>
                <label className="block text-gray-600">Phones</label>
                {editMode ? (
                  <div className="space-y-2">
                    {formData.phones?.map((phone, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={phone}
                          type="tel"
                          onChange={(e) => {
                            const newPhones = [...formData.phones];
                            newPhones[i] = e.target.value;
                            setFormData({ ...formData, phones: newPhones });
                          }}
                          className="w-full border rounded p-2"
                          placeholder="Enter phone number"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPhones = formData.phones.filter(
                              (_, idx) => idx !== i
                            );
                            setFormData({ ...formData, phones: newPhones });
                          }}
                          className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <FaXmark size={14} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          !formData.phones ||
                          formData.phones.length === 0 ||
                          formData.phones[formData.phones.length - 1].trim() !==
                            ""
                        ) {
                          setFormData({
                            ...formData,
                            phones: [...(formData.phones || []), ""],
                          });
                        }
                      }}
                      className="flex items-center gap-1 px-3 align-items-center py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FaPlus className="inline-block" size={14} /> Add Phone
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc pl-5">
                    {userData.phones?.length > 0 ? (
                      userData.phones.map((p, i) => <li key={i}>{p}</li>)
                    ) : (
                      <li>Not set</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Links */}
              <div className="md:col-span-2">
                {editMode ? (
                  <>
                    <label className="block text-gray-600">Links</label>
                    <div className="space-y-2">
                      {formData.links?.map((link, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={link}
                            onChange={(e) => {
                              const newLinks = [...formData.links];
                              newLinks[i] = e.target.value;
                              setFormData({ ...formData, links: newLinks });
                            }}
                            className="w-full border rounded p-2"
                            placeholder="https://example.com"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = formData.links.filter(
                                (_, idx) => idx !== i
                              );
                              setFormData({ ...formData, links: newLinks });
                            }}
                            className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <FaXmark size={14} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            !formData.links ||
                            formData.links.length === 0 ||
                            formData.links[formData.links.length - 1].trim() !==
                              ""
                          ) {
                            setFormData({
                              ...formData,
                              links: [...(formData.links || []), ""],
                            });
                          }
                        }}
                        className="flex items-center gap-1 px-3 align-items-center py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <FaPlus className="inline-block" size={14} /> Add Link
                      </button>
                    </div>
                  </>
                ) : (
                  <ul className="list-disc pl-5">
                    {userData.links?.length > 0 && (
                      <>
                        <label className="block text-gray-600">Links</label>
                        {userData.links.map((link, i) => (
                          <li key={i}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {link}
                            </a>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Bio & Role */}
        <div style={{ marginTop: "0 !important" }}>
          {(userData.role || userData.bio || editMode) && (
            <h3 className="text-lg font-semibold mb-2">About</h3>
          )}
          <div>
            {editMode ? (
              <>
                <label className="block text-gray-600">Role</label>
                <input
                  name="role"
                  value={formData.role || userData.role || ""}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </>
            ) : (
              userData.role && (
                <>
                  <label className="block text-gray-600">Role</label>
                  <p>{userData.role}</p>
                </>
              )
            )}
          </div>
          <div className="mt-4">
            {editMode ? (
              <>
                <label className="block text-gray-600">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || userData.bio || ""}
                  onChange={handleChange}
                  className="w-full border rounded p-2 resize-none"
                />
              </>
            ) : (
              userData.bio && (
                <>
                  <label className="block text-gray-600">Bio</label>
                  <p>{userData.bio || "No bio yet"}</p>
                </>
              )
            )}
          </div>
        </div>

        {/* Account Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Account Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              {editMode && userData.memberSince ? (
                <>
                  <label className="block text-gray-600">Member Since: </label>
                  <p className="bg-gray-100 p-2 rounded">
                    {formatDate(userData.memberSince) || "Not set"}
                  </p>
                </>
              ) : (
                userData.memberSince && (
                  <>
                    <label className="block text-gray-600">
                      Member Since:{" "}
                    </label>
                    <p className="p-2 rounded">
                      {formatDate(userData.memberSince) || "Not set"}
                    </p>
                  </>
                )
              )}
            </div>

            <div className="flex items-center">
              {editMode && userData.lastLogin ? (
                <>
                  <label className="block text-gray-600">Last Login: </label>
                  <p className="bg-gray-100 p-2 rounded">
                    {formatDate(userData.lastLogin) || "Not set"}
                  </p>
                </>
              ) : (
                userData.lastLogin && (
                  <>
                    <label className="block text-gray-600">Last Login: </label>
                    <p className="p-2 rounded">
                      {formatDate(userData.lastLogin)}
                    </p>
                  </>
                )
              )}
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Activity Stats</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded p-4">
              <p className="text-xl font-bold">{userData.projectsCount || 0}</p>
              <p className="text-gray-500">Projects</p>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-xl font-bold">
                {userData.completedTasks || 0}
              </p>
              <p className="text-gray-500">Completed Tasks</p>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-xl font-bold">{userData.pendingTasks || 0}</p>
              <p className="text-gray-500">Pending Tasks</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setFormData(userData);
                setEditMode(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
