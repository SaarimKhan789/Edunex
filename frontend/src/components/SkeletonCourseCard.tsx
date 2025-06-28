import { motion } from "framer-motion";
export const SkeletonCourseCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
  >
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 w-full" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="flex justify-between mt-4">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex mt-3 space-x-2">
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  </motion.div>
);
