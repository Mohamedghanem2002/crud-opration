import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ShareModel = ({ profileLink, setShowShare }) => {
  return (
              <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-lg font-semibold mb-4">Share Your Profile</h2>
              <input
                type="text"
                readOnly
                value={profileLink}
                className="w-full border rounded p-2 mb-4 bg-gray-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profileLink);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => setShowShare(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
  )
}

export default ShareModel