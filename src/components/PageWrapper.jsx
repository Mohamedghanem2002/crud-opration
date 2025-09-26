import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }} // 👈 تبدأ فوق بشوية
      animate={{ opacity: 1, y: 0 }} // 👈 تنزل مكانها الطبيعي
      exit={{ opacity: 0, y: 50 }} // 👈 وقت الخروج تنزل لتحت
      transition={{ duration: 0.6, ease: "easeInOut" }} // مدة الأنيميشن
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
