const AboutSection = ({ userData, formData, setFormData, editMode }) => (
  <div className="mt-4">
    {(userData.role || userData.bio || editMode) && (
      <h3 className="text-lg font-semibold mb-2">About</h3>
    )}
    <div>
      {/* Role */}
      {editMode ? (
        <>
          <label className="block text-gray-600">Role</label>
          <input
            name="role"
            value={formData.role || userData.role || ""}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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

      {/* Bio */}
      <div className="mt-4">
        {editMode ? (
          <>
            <label className="block text-gray-600">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || userData.bio || ""}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
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
  </div>
);

export default AboutSection;
