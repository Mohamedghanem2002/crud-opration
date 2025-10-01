import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
