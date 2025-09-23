import { useState } from "react";
import toast from "react-hot-toast";
import LoadingOverlay from "./loader";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";

export default function AddMemberModal({
  newMember,
  onChange,
  onClose,
  onSave,
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!newMember.inviteeEmail) errs.inviteeEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newMember.inviteeEmail))
      errs.inviteeEmail = "Email is invalid";

    if (!newMember.role) errs.role = "Role is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // check if user exists in users collection
      const q = query(
        collection(db, "users"),
        where("email", "==", newMember.inviteeEmail)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("This email is not registered as a user");
        setLoading(false);
        return;
      }

      await onSave(); // continue saving if exists
      onClose();
    } catch (err) {
      toast.error("Error saving member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Member
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            name="inviteeEmail"
            placeholder="Email"
            value={newMember.inviteeEmail || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          <select
            name="role"
            value={newMember.role}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
            <option value="Editor">Editor</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? <LoadingOverlay /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
