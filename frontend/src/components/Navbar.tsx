// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { BookOpen, LogOut, User } from "lucide-react";
// import { useAuthStore } from "../store/authStore";
// import { useState, useEffect } from "react";

// export const Navbar = () => {
//   const { isAuthenticated, user, logout } = useAuthStore();

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className="bg-white shadow-lg fixed w-full top-0 z-50"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2">
//               <BookOpen className="h-8 w-8 text-indigo-600" />
//               <span className="text-2xl font-bold text-gray-900">Edunex</span>
//             </Link>
//           </div>

//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               <>
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   className="flex items-center space-x-2"
//                 >
//                   <img
//                     src={
//                       user?.avatar ||
//                       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                     }
//                     alt={user?.name}
//                     className="h-8 w-8 rounded-full"
//                   />
//                   <span className="text-gray-700">{user?.name}</span>
//                 </motion.div>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={logout}
//                   className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
//                 >
//                   <LogOut className="h-5 w-5" />
//                   <span>Logout</span>
//                 </motion.button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 text-indigo-600 hover:text-indigo-700"
//                   >
//                     Login
//                   </motion.button>
//                 </Link>
//                 <Link to="/register">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                   >
//                     Register
//                   </motion.button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, LogOut, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg fixed w-full top-0 z-50 h-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Edunex</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                    alt={user?.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-gray-700">{user?.name}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-700"
                    disabled={true}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    disabled={true}
                  >
                    Register
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
