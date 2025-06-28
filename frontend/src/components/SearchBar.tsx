// // import React, { useState } from "react";
// // import { Search } from "lucide-react";
// // import { motion } from "framer-motion";

// // interface SearchBarProps {
// //   searchQuery: string;
// //   searchBy: "title" | "tutor_name";
// //   onSearchChange: (query: string) => void;
// //   onSearchByChange: (criteria: "title" | "tutor_name") => void;
// // }

// // export const SearchBar: React.FC<SearchBarProps> = ({
// //   searchQuery,
// //   searchBy,
// //   onSearchChange,
// //   onSearchByChange,
// // }) => {
// //   const [query, setQuery] = useState(searchQuery);

// //   // Handle query change
// //   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setQuery(e.target.value);
// //   };

// //   // Trigger search on Enter key press
// //   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === "Enter") {
// //       onSearchChange(query);
// //     }
// //   };

// //   // Handle search type change
// //   const handleSearchBySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     onSearchByChange(e.target.value as "title" | "tutor_name");
// //   };

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: -20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="relative w-full max-w-xl mx-auto mb-8"
// //     >
// //       <div className="flex items-center space-x-4">
// //         {/* Search by dropdown */}
// //         <select
// //           value={searchBy}
// //           onChange={handleSearchBySelect}
// //           className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //         >
// //           <option value="title">Search by Title</option>
// //           <option value="tutor_name">Search by Tutor Name</option>
// //         </select>

// //         {/* Search input field */}
// //         <div className="relative flex-1">
// //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
// //           <input
// //             type="text"
// //             value={query}
// //             onChange={handleSearchChange}
// //             onKeyPress={handleKeyPress}
// //             placeholder={`Search by ${searchBy}...`}
// //             className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //           />
// //         </div>

// //         {/* Search button */}
// //         <button
// //           onClick={() => onSearchChange(query)}
// //           className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //         >
// //           Search
// //         </button>
// //       </div>
// //     </motion.div>
// //   );
// // };
// import React from "react";
// import { Search } from "lucide-react";
// import { motion } from "framer-motion";

// interface SearchBarProps {
//   searchQuery: string;
//   searchBy: "course_title" | "tutor_name";
//   onSearchChange: (query: string) => void;
//   onSearchByChange: (criteria: "course_title" | "tutor_name") => void;
//   onSearch: () => void;
// }

// export const SearchBar: React.FC<SearchBarProps> = ({
//   searchQuery,
//   searchBy,
//   onSearchChange,
//   onSearchByChange,
//   onSearch,
// }) => {
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       onSearch();
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="w-full max-w-4xl mx-auto mb-8"
//     >
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="flex-1 relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => onSearchChange(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder={`Search ${searchBy.replace("_", " ")}...`}
//             className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           />
//         </div>

//         <div className="flex space-x-2">
//           <select
//             value={searchBy}
//             onChange={(e) => onSearchByChange(e.target.value as any)}
//             className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="course_title">By Course Title</option>
//             <option value="tutor_name">By Tutor Name</option>
//           </select>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onSearch}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             Search
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  searchQuery: string;
  searchBy: "course_title" | "tutor_name";
  onSearchChange: (query: string) => void;
  onSearchByChange: (criteria: "course_title" | "tutor_name") => void;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  searchBy,
  onSearchChange,
  onSearchByChange,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Search ${searchBy.replace("_", " ")}...`}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex space-x-2">
          <select
            value={searchBy}
            onChange={(e) => onSearchByChange(e.target.value as any)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="course_title">By Course Title</option>
            <option value="tutor_name">By Tutor Name</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSearch}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
