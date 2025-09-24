// const UserInfoSection = ({
//   userData,
//   formData,
//   setFormData,
//   editMode,
//   isPublic = false,
// }) => (
//   <div>
//     <h3 className="text-lg font-semibold mb-2">User Information</h3>
//     <div className="grid md:grid-cols-2 gap-4">
//       {/* Name */}
//       <div>
//         <label className="block text-gray-600">Name</label>
//         {editMode ? (
//           <p className="bg-gray-100 p-2 rounded">
//             {formData.name || userData.name}
//           </p>
//         ) : (
//           <p className="p-2 rounded">{userData.name}</p>
//         )}
//       </div>

//       {/* Date of Birth */}
//       <div>
//         {editMode ? (
//           <>
//             <label className="block text-gray-600">Date of Birth</label>
//             <input
//               type="date"
//               name="dob"
//               value={formData.dob || userData.dob || ""}
//               onChange={(e) =>
//                 setFormData({ ...formData, dob: e.target.value })
//               }
//               className="w-full border rounded p-2"
//             />
//           </>
//         ) : (
//           userData.dob && (
//             <>
//               <label className="block text-gray-600">Date of Birth</label>
//               <p>{userData.dob}</p>
//             </>
//           )
//         )}
//       </div>

//       {/* Location */}
//       <div>
//         {editMode ? (
//           <>
//             <label className="block text-gray-600">Location</label>
//             <input
//               name="location"
//               value={formData.location || userData.location || ""}
//               onChange={(e) =>
//                 setFormData({ ...formData, location: e.target.value })
//               }
//               className="w-full border rounded p-2"
//             />
//           </>
//         ) : (
//           userData.location && (
//             <>
//               <label className="block text-gray-600">Location</label>
//               <p>{userData.location}</p>
//             </>
//           )
//         )}
//       </div>
//     </div>
//   </div>
// );

// export default UserInfoSection;
const UserInfoSection = ({ userData, formData, setFormData, editMode }) => (
  <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="text-lg font-semibold mb-4">User Information</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-500 mb-1">Name</label>
        {editMode ? (
          <p className="p-2 rounded bg-gray-50">{userData.name}</p>
        ) : (
          <p className="p-2">{userData.name}</p>
        )}
      </div>

      <div>
        {editMode ? (
          <>
            <label className="block text-gray-500 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob || userData.dob || ""}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </>
        ) : (
          userData.dob && (
            <>
              <label className="block text-gray-500 mb-1">Date of Birth</label>
              <p className="p-2">{userData.dob || "Not set"}</p>
            </>
          )
        )}
      </div>

      <div className="sm:col-span-2">
        {editMode ? (
          <>
            <label className="block text-gray-500 mb-1">Location</label>
            <input
              type="text"
              value={formData.location || userData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </>
        ) : (
          userData.location && (
            <>
              <label className="block text-gray-500 mb-1">Location</label>
              <p className="p-2">
                {userData.location || "Not set"}
              </p>
            </>
          )
        )}
      </div>
    </div>
  </div>
);

export default UserInfoSection;
