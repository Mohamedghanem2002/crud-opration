import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react"; // أو أي أيقونة/لوجو خاص بيك

export default function TransitionScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2"
      >
        <CheckSquare className="text-blue-600" size={60} />
        <span className="text-xl font-bold text-blue-900">Task Manager</span>
      </motion.div>
    </motion.div>
  );
}
