// import React from "react";
// import { motion } from "framer-motion";
// import { Clock, Users, Star } from "lucide-react";
// import { Course } from "../types";

// interface CourseCardProps {
//   course: Course;
// }

// export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
//   return (
//     <motion.div
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-lg shadow-md overflow-hidden"
//     >
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">
//           {course.title}
//         </h3>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//           {course.description}
//         </p>

//         <div className="text-sm text-gray-500 mb-4">
//           <div className="mb-2">
//             <strong>Platform Name:</strong>{" "}
//             {course.platform_name || "Not specified"}
//           </div>
//           <div className="mb-2">
//             <strong>Certifications:</strong>{" "}
//             {course.certifications || "Not available"}
//           </div>
//           <div className="mb-2">
//             <strong>Difficulty Level:</strong>{" "}
//             {course.difficulty_level || "Not specified"}
//           </div>
//           <div className="mb-2">
//             <strong>Location:</strong> {course.location || "Not specified"}
//           </div>
//           <div className="mb-2">
//             <strong>Price:</strong> {course.price || "Free"}
//           </div>
//           <div className="mb-2">
//             <strong>Tutor:</strong> {course.tutor_name || "Not specified"}
//           </div>
//         </div>

//         <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//           <div className="flex items-center space-x-1">
//             <Clock className="h-4 w-4" />
//             <span>{course.duration || "N/A"}</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <Users className="h-4 w-4" />
//             <span>{course.num_enrollments} students</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <Star className="h-4 w-4 text-yellow-400" />
//             <span>{course.rating || "N/A"}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
//           >
//             Enroll Now
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Star } from "lucide-react";
import { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Get actual values from course object
  const title = course.course_title || "Untitled Course";
  const description = course.description || "";
  const platform =
    course.platform_name || course.platform_name || "Not specified";
  const certifications = course.certifications || "Not available";
  const difficulty = course.difficulty_level || "Not specified";
  const location = course.location || "Not specified";
  const price = course.price || "Free";
  const tutor = course.tutor_name || "Not specified";
  const enrollments = course.num_enrollments || "N/A";
  const rating = course.rating || "N/A";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
    >
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="text-sm text-gray-500 mb-4 space-y-1">
          <div className="flex">
            <span className="font-medium w-32">Platform:</span>
            <span>{platform}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Certifications:</span>
            <span>{certifications}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Difficulty:</span>
            <span>{difficulty}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Location:</span>
            <span>{location}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Price:</span>
            <span>{price}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Tutor:</span>
            <span>{tutor}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{enrollments} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};
