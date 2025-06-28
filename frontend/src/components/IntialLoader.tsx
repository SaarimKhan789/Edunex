import { motion } from "framer-motion";
import { FloatingCircle } from "./FloatingCircle";
import { BookOpenIcon } from "./BookOpenIcon";
export const InitialLoader = () => (
  <motion.div
    className="flex flex-col items-center justify-center h-[60vh]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="relative flex items-center justify-center mb-8">
      <motion.div
        className="absolute border-4 border-indigo-200 rounded-full"
        animate={{
          width: [100, 120, 100],
          height: [100, 120, 100],
          opacity: [0.8, 0.4, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute border-4 border-indigo-300 rounded-full"
        animate={{
          width: [80, 100, 80],
          height: [80, 100, 80],
          opacity: [0.8, 0.4, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      <motion.div
        className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <BookOpenIcon className="text-white w-8 h-8" />
      </motion.div>

      <FloatingCircle size={12} delay={0} />
      <FloatingCircle size={8} delay={0.2} />
      <FloatingCircle size={10} delay={0.4} />
    </div>

    <motion.h2
      className="text-2xl font-bold text-indigo-700 mt-8"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Welcome to Edunex
    </motion.h2>
    <motion.h2
      className="text-2xl font-bold text-indigo-700 mt-8"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Discovering Learning Opportunities
    </motion.h2>

    <motion.p
      className="text-gray-500 mt-2"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    >
      Gathering courses from all sources
    </motion.p>
  </motion.div>
);
