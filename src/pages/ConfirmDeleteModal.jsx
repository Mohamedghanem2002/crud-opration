export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, member }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[400px] text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Remove Member
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-medium text-red-600">
            {member?.name || member?.email}
          </span>{" "}
          from this project?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
