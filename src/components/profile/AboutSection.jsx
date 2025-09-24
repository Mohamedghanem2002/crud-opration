const AboutSection = ({ userData, formData, setFormData, editMode }) =>
  (userData.role || userData.bio || editMode) ? (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {(userData.role || userData.bio || editMode) && (
        <h3 className="text-lg font-semibold mb-4">About</h3>
      )}

      {/* Role */}
      <div className="mb-4">
        {editMode ? (
          <>
            <label className="block text-gray-500 mb-1">Role</label>
            <input
              type="text"
              value={formData.role || userData.role || ""}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </>
        ) : (
          userData.role && (
            <>
              <label className="block text-gray-500 mb-1">Role</label>
              <p className="p-2">{userData.role || "Not set"}</p>
            </>
          )
        )}
      </div>

      {/* Bio */}
      <div>
        {editMode ? (
          <>
            <label className="block text-gray-500 mb-1">Bio</label>
            <textarea
              value={formData.bio || userData.bio || ""}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full border border-gray-200 rounded p-2 resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
              rows={4}
            />
          </>
        ) : (
          userData.bio && (
            <>
              <label className="block text-gray-500 mb-1">Bio</label>
              <p className="p-2 rounded bg-gray-50">
                {userData.bio || "No bio yet"}
              </p>
            </>
          )
        )}
      </div>
    </div>
  ) : (
    <></>
  );

export default AboutSection;
