import { motion } from "framer-motion";
export const AnimatedSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="flex justify-center items-center"
  >
    <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full" />
  </motion.div>
);
