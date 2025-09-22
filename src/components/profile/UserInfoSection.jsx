const UserInfoSection = ({
  userData,
  formData,
  setFormData,
  editMode,
  isPublic = false,
}) => (
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
          <p className="p-2 rounded">{userData.name}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        {editMode ? (
          <>
            <label className="block text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob || userData.dob || ""}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
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

      {/* Location */}
      <div>
        {editMode ? (
          <>
            <label className="block text-gray-600">Location</label>
            <input
              name="location"
              value={formData.location || userData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </>
        ) : (
          userData.location && (
            <>
              <label className="block text-gray-600">Location</label>
              <p>{userData.location}</p>
            </>
          )
        )}
      </div>
    </div>
  </div>
);

export default UserInfoSection;
