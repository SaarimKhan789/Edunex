// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { CourseCard } from "../components/CourseCard";
// import { SearchBar } from "../components/SearchBar";
// import { FilterSidebar } from "../components/FilterSidebar";
// import { Course } from "../types";

// interface Filter {
//   id: string;
//   name: string;
//   options: string[];
// }

// export const Home: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filters, setFilters] = useState<Filter[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState<
//     Record<string, string[]>
//   >({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchBy, setSearchBy] = useState<"title" | "tutor_name">("title");
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(12); // Adjustable

//   const fetchCourses = async (payload: any = {}) => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://127.0.0.1:3000/filtered-courses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const rawText = await response.text();
//       const cleanText = rawText.replace(/NaN/g, "null");
//       const data = JSON.parse(cleanText);

//       setCourses(Array.isArray(data) ? data.slice(0, itemsPerPage) : []);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       setCourses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFilters = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:3000/unique-values/");
//       const rawText = await response.text();
//       const cleanText = rawText.replace(/NaN/g, "null");
//       const data = JSON.parse(cleanText);

//       const transformed = Object.keys(data).map((key) => ({
//         id: key,
//         name: key.charAt(0).toUpperCase() + key.slice(1),
//         options: data[key],
//       }));
//       setFilters(transformed);
//     } catch (error) {
//       console.error("Error fetching filters:", error);
//     }
//   };

//   const preparePayload = (): any => {
//     const validFilters = Object.fromEntries(
//       Object.entries(selectedFilters).filter(([_, val]) => val?.length)
//     );

//     // Transform rating if needed
//     if (validFilters["rating"]) {
//       const ratingVal = validFilters["rating"][0];
//       validFilters["rating"] = [">=" + ratingVal];
//     }

//     return {
//       [searchBy]: searchQuery.trim(),
//       ...validFilters,
//     };
//   };

//   useEffect(() => {
//     fetchFilters();
//     fetchCourses(); // Initial load
//   }, []);

//   const handleSearchChange = async (query: string) => {
//     setSearchQuery(query);
//     const payload = preparePayload();
//     payload[searchBy] = query.trim();
//     fetchCourses(payload);
//   };

//   const handleSearchByChange = (criteria: "title" | "tutor_name") => {
//     setSearchBy(criteria);
//   };

//   const handleFilterChange = (filterId: string, value: string[]) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [filterId]: value,
//     }));
//   };

//   const handleApplyFilters = async () => {
//     const payload = preparePayload();
//     console.log("Applying filters:", payload);
//     fetchCourses(payload);
//   };

//   useEffect(() => {
//     const resetFilters = async () => {
//       try {
//         await fetch("http://127.0.0.1:3000/filtered-courses", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({}),
//         });
//         fetchCourses();
//       } catch (error) {
//         console.error("Error resetting filters:", error);
//       }
//     };
//     resetFilters();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <FilterSidebar
//         filters={filters}
//         selectedFilters={selectedFilters}
//         onFilterChange={handleFilterChange}
//         onApplyFilters={handleApplyFilters}
//       />
//       <motion.div
//         className="w-full flex flex-col items-center p-4 ml-64 pt-20"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <SearchBar
//           searchQuery={searchQuery}
//           searchBy={searchBy}
//           onSearchChange={handleSearchChange}
//           onSearchByChange={handleSearchByChange}
//         />
//         <div className="grid grid-cols-3 gap-4 mt-8">
//           {loading ? (
//             <p>Loading...</p>
//           ) : courses && courses.length > 0 ? (
//             courses.map((course) => (
//               <CourseCard key={course.id} course={course} />
//             ))
//           ) : (
//             <p>No courses available</p>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { CourseCard } from "../components/CourseCard";
// import { SearchBar } from "../components/SearchBar";
// import { FilterSidebar } from "../components/FilterSidebar";
// import { Course } from "../types";

// // API Endpoints
// const API_BASE_URL = "http://localhost:4000";
// const FILTERED_COURSES_URL = `${API_BASE_URL}/api/filterschema/filtered-courses`;
// const UNIQUE_VALUES_URL = `${API_BASE_URL}/api/filterschema/unique-values`;

// interface Filter {
//   id: string;
//   name: string;
//   options: string[];
// }

// export const Home: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filters, setFilters] = useState<Filter[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState<
//     Record<string, string[]>
//   >({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchBy, setSearchBy] = useState<"course_title" | "tutor_name">(
//     "course_title"
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(12);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCourses = useMemo(() => {
//     return courses.slice(indexOfFirstItem, indexOfLastItem);
//   }, [courses, indexOfFirstItem, indexOfLastItem]);

//   const totalPages = Math.ceil(courses.length / itemsPerPage);
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [courses]);

//   // Pagination controls
//   const goToNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const goToPrevPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };
//   // Fetch initial courses when component mounts
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch initial courses
//         const coursesResponse = await fetch(FILTERED_COURSES_URL, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({}),
//         });

//         if (!coursesResponse.ok) {
//           throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
//         }

//         const coursesData = await coursesResponse.json();
//         setCourses(Array.isArray(coursesData) ? coursesData : []);

//         // Fetch filter options
//         const filtersResponse = await fetch(UNIQUE_VALUES_URL);

//         if (!filtersResponse.ok) {
//           throw new Error(`Failed to fetch filters: ${filtersResponse.status}`);
//         }

//         const filtersData = await filtersResponse.json();
//         const transformed = Object.keys(filtersData).map((key) => ({
//           id: key,
//           name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
//           options: filtersData[key],
//         }));

//         setFilters(transformed);
//       } catch (err) {
//         console.error("Initialization error:", err);
//         setError(err.message || "Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Prepare payload for filtered search
//   const preparePayload = useCallback(() => {
//     const payload: Record<string, any> = {};

//     // Add search criteria
//     if (searchQuery.trim()) {
//       payload[searchBy] = searchQuery.trim();
//     }

//     // Add filters
//     Object.entries(selectedFilters).forEach(([key, values]) => {
//       if (values.length > 0) {
//         // Special handling for rating
//         if (key === "rating" && values[0]) {
//           payload[key] = [`>=${values[0]}`];
//         } else {
//           payload[key] = values;
//         }
//       }
//     });

//     return payload;
//   }, [searchQuery, searchBy, selectedFilters]);

//   // Fetch filtered courses
//   const fetchFilteredCourses = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const payload = preparePayload();

//       const response = await fetch(FILTERED_COURSES_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Request failed: ${response.status}`);
//       }

//       const data = await response.json();
//       setCourses(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Filter error:", err);
//       setError(err.message || "Failed to apply filters");
//     } finally {
//       setLoading(false);
//     }
//   }, [preparePayload]);

//   // Handle filter changes
//   const handleFilterChange = (filterId: string, value: string[]) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [filterId]: value,
//     }));
//   };

//   // Apply filters and search
//   const applyFilters = () => {
//     fetchFilteredCourses();
//   };

//   // Reset filters and search
//   const resetFilters = () => {
//     setSearchQuery("");
//     setSelectedFilters({});
//     fetchFilteredCourses();
//   };

//   // Render loading state
//   if (loading && courses.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
//         <span className="ml-4 text-lg">Loading courses...</span>
//       </div>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold text-red-600 mb-4">
//             Error Loading Data
//           </h2>
//           <p className="text-gray-700 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <FilterSidebar
//         filters={filters}
//         selectedFilters={selectedFilters}
//         onFilterChange={handleFilterChange}
//         onApplyFilters={applyFilters}
//         onResetFilters={resetFilters}
//       />

//       <motion.div
//         className="w-full flex flex-col items-center p-4 ml-64 pt-20"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <SearchBar
//           searchQuery={searchQuery}
//           searchBy={searchBy}
//           onSearchChange={setSearchQuery}
//           onSearchByChange={setSearchBy}
//           onSearch={applyFilters}
//         />

//         {loading ? (
//           <div className="flex justify-center items-center h-64 w-full">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//         ) : courses.length === 0 ? (
//           <div className="text-center py-10 w-full">
//             <h3 className="text-lg font-medium text-gray-900">
//               No courses found
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               Try adjusting your search or filter criteria
//             </p>
//             <button
//               onClick={resetFilters}
//               className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//             >
//               Reset Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center w-full max-w-6xl mb-4">
//               <h2 className="text-xl font-semibold">
//                 Showing {courses.length} courses
//               </h2>
//               <button
//                 onClick={resetFilters}
//                 className="text-sm text-indigo-600 hover:text-indigo-800"
//               >
//                 Clear all filters
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
//               {courses.map((course) => (
//                 <CourseCard
//                   key={`${course.unique_id}-${course.source}`}
//                   course={course}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { CourseCard } from "../components/CourseCard";
// import { SearchBar } from "../components/SearchBar";
// import { FilterSidebar } from "../components/FilterSidebar";
// import { Course } from "../types";
// import { SkeletonCourseCard } from "../components/SkeletonCourseCard";
// import { AnimatePresence } from "framer-motion";
// import { InitialLoader } from "../components/IntialLoader";
// // API Endpoints
// const API_BASE_URL = "http://localhost:4000";
// const FILTERED_COURSES_URL = `${API_BASE_URL}/api/filterschema/filtered-courses`;
// const UNIQUE_VALUES_URL = `${API_BASE_URL}/api/filterschema/unique-values`;
// const OFFERING_TYPES_URL = `${API_BASE_URL}/api/filterschema/offering-types`;
// const GLOBAL_COURSES_URL = `${API_BASE_URL}/api/globaldata/global-data`;
// interface Filter {
//   id: string;
//   name: string;
//   options: string[];
// }

// export const Home: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filters, setFilters] = useState<Filter[]>([]);
//   const [offeringTypes, setOfferingTypes] = useState<string[]>([]);

//   const [selectedFilters, setSelectedFilters] = useState<
//     Record<string, string[]>
//   >({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchBy, setSearchBy] = useState<"course_title" | "tutor_name">(
//     "course_title"
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(12);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCourses = useMemo(() => {
//     return courses.slice(indexOfFirstItem, indexOfLastItem);
//   }, [courses, indexOfFirstItem, indexOfLastItem]);

//   const totalPages = Math.ceil(courses.length / itemsPerPage);
//   useEffect(() => {
//     const fetchOfferingTypes = async () => {
//       try {
//         const response = await fetch(OFFERING_TYPES_URL);
//         if (!response.ok) throw new Error("Failed to fetch offering types");
//         const data = await response.json();
//         setOfferingTypes(data);
//       } catch (error) {
//         console.error("Error fetching offering types:", error);
//         setOfferingTypes([]);
//       }
//     };

//     fetchOfferingTypes();
//   }, []);

//   // Reset to first page when courses change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [courses]);

//   // Pagination controls
//   const goToNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const goToPrevPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   // Fetch initial courses when component mounts
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all data in parallel
//         const [offeringTypesRes, coursesRes, filtersRes] = await Promise.all([
//           fetch(OFFERING_TYPES_URL),
//           fetch(GLOBAL_COURSES_URL, {
//             method: "GET",
//             headers: { "Content-Type": "application/json" },
//           }),
//           fetch(UNIQUE_VALUES_URL),
//         ]);
//         console.log("offeringTypesRes", offeringTypesRes);

//         // Handle offering types
//         if (!offeringTypesRes.ok)
//           throw new Error("Failed to fetch offering types");
//         const offeringTypesData = await offeringTypesRes.json();
//         setOfferingTypes(offeringTypesData);

//         // Handle courses
//         if (!coursesRes.ok)
//           throw new Error(`Failed to fetch courses: ${coursesRes.status}`);
//         const coursesData = await coursesRes.json();
//         setCourses(Array.isArray(coursesData) ? coursesData : []);

//         // Handle filters
//         if (!filtersRes.ok)
//           throw new Error(`Failed to fetch filters: ${filtersRes.status}`);
//         const filtersData = await filtersRes.json();

//         // Build filters with offering types
//         const transformed = [
//           ...Object.keys(filtersData).map((key) => ({
//             id: key,
//             name: key.replace(/_/g, " "),
//             options: filtersData[key],
//           })),
//           {
//             id: "offering_type",
//             name: "Source Database",
//             options: offeringTypesData, // Use freshly fetched data
//           },
//         ];

//         setFilters(transformed);
//       } catch (err) {
//         console.error("Initialization error:", err);
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("Failed to load data");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []); // Only runs once on mount

//   // Prepare payload for filtered search
//   const preparePayload = useCallback(() => {
//     const payload: Record<string, any> = {};

//     // Add search criteria
//     if (searchQuery.trim()) {
//       payload[searchBy] = searchQuery.trim();
//     }

//     // Add filters
//     Object.entries(selectedFilters).forEach(([key, values]) => {
//       if (values.length > 0) {
//         // Special handling for rating
//         if (key === "rating" && values[0]) {
//           payload[key] = [`>=${values[0]}`];
//         } else {
//           payload[key] = values;
//         }
//       }
//     });

//     return payload;
//   }, [searchQuery, searchBy, selectedFilters]);

//   // Fetch filtered courses
//   const fetchFilteredCourses = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const payload = preparePayload();

//       const response = await fetch(FILTERED_COURSES_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Request failed: ${response.status}`);
//       }

//       const data = await response.json();
//       setCourses(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Filter error:", err);
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Failed to load data");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [preparePayload]);

//   // Handle filter changes
//   const handleFilterChange = (filterId: string, value: string[]) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [filterId]: value,
//     }));
//   };

//   // Apply filters and search
//   const applyFilters = () => {
//     fetchFilteredCourses();
//   };

//   // Reset filters and search
//   const resetFilters = () => {
//     setSearchQuery("");
//     setSelectedFilters({});
//     setCurrentPage(1);
//     fetchFilteredCourses();
//   };

//   // Render loading state
//   if (loading && courses.length === 0) {
//     return (
//       <div className="flex align-items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-white">
//         <InitialLoader />
//       </div>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
//           <h2 className="text-xl font-bold text-red-600 mb-4">
//             Error Loading Data
//           </h2>
//           <p className="text-gray-700 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <FilterSidebar
//         filters={filters}
//         selectedFilters={selectedFilters}
//         onFilterChange={handleFilterChange}
//         onApplyFilters={applyFilters}
//         onResetFilters={resetFilters}
//       />

//       <motion.div
//         className="w-full flex flex-col items-center p-4 ml-64 pt-20"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <SearchBar
//           searchQuery={searchQuery}
//           searchBy={searchBy}
//           onSearchChange={setSearchQuery}
//           onSearchByChange={setSearchBy}
//           onSearch={applyFilters}
//         />

//         {/* Results info */}
//         <div className="flex justify-between items-center w-full max-w-6xl mb-4">
//           <h2 className="text-sm md:text-base font-semibold text-gray-700">
//             Showing {indexOfFirstItem + 1}-
//             {Math.min(indexOfLastItem, courses.length)} of {courses.length}{" "}
//             courses
//           </h2>

//           {/* Items per page selector */}
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-600">Items per page:</span>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               className="border rounded px-2 py-1 text-sm"
//             >
//               <option value={6}>6</option>
//               <option value={12}>12</option>
//               <option value={24}>24</option>
//               <option value={48}>48</option>
//             </select>
//           </div>
//         </div>

//         {/* Course grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
//           {loading ? (
//             <AnimatePresence>
//               {Array.from({ length: itemsPerPage }).map((_, index) => (
//                 <motion.div
//                   key={`skeleton-${index}`}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{
//                     delay: index * 0.05,
//                     type: "spring",
//                     stiffness: 100,
//                   }}
//                 >
//                   <SkeletonCourseCard />
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           ) : currentCourses.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="col-span-full text-center py-10"
//             >
//               <h3 className="text-lg font-medium text-gray-900">
//                 No courses found
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Try adjusting your search or filter criteria
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={resetFilters}
//                 className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
//               >
//                 Reset Filters
//               </motion.button>
//             </motion.div>
//           ) : (
//             <AnimatePresence>
//               {currentCourses.map((course, index) => (
//                 <motion.div
//                   key={`${course.unique_id}`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   transition={{
//                     delay: index * 0.05,
//                     type: "spring",
//                     stiffness: 120,
//                   }}
//                   layout
//                 >
//                   <CourseCard course={course} />
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           )}
//         </div>

//         {/* Pagination controls */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center space-x-2 mt-4">
//             <button
//               onClick={goToPrevPage}
//               disabled={currentPage === 1}
//               className={`p-2 rounded-full ${
//                 currentPage === 1
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "text-indigo-600 hover:bg-indigo-50"
//               }`}
//             >
//               <ChevronLeft size={20} />
//             </button>

//             {[...Array(totalPages)].map((_, index) => {
//               const page = index + 1;
//               // Show first, last, and pages around current page
//               if (
//                 page === 1 ||
//                 page === totalPages ||
//                 (page >= currentPage - 1 && page <= currentPage + 1)
//               ) {
//                 return (
//                   <button
//                     key={page}
//                     onClick={() => goToPage(page)}
//                     className={`w-8 h-8 rounded-full text-sm ${
//                       currentPage === page
//                         ? "bg-indigo-600 text-white"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 );
//               }

//               // Show ellipsis for gaps
//               if (page === currentPage - 2 || page === currentPage + 2) {
//                 return (
//                   <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
//                     ...
//                   </span>
//                 );
//               }

//               return null;
//             })}

//             <button
//               onClick={goToNextPage}
//               disabled={currentPage === totalPages}
//               className={`p-2 rounded-full ${
//                 currentPage === totalPages
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "text-indigo-600 hover:bg-indigo-50"
//               }`}
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { SearchBar } from "../components/SearchBar";
import { FilterSidebar } from "../components/FilterSidebar";
import { Course } from "../types";
import { SkeletonCourseCard } from "../components/SkeletonCourseCard";
import { AnimatePresence } from "framer-motion";
import { InitialLoader } from "../components/IntialLoader";

// API Endpoints
const API_BASE_URL = "http://localhost:4000";
const FILTERED_COURSES_URL = `${API_BASE_URL}/api/filterschema/filtered-courses`;
const UNIQUE_VALUES_URL = `${API_BASE_URL}/api/filterschema/unique-values`;
const OFFERING_TYPES_URL = `${API_BASE_URL}/api/filterschema/offering-types`;

interface Filter {
  id: string;
  name: string;
  options: string[];
}

export const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [offeringTypes, setOfferingTypes] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"course_title" | "tutor_name">(
    "course_title"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersChanged, setFiltersChanged] = useState(false); // Track filter changes

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = useMemo(() => {
    return courses.slice(indexOfFirstItem, indexOfLastItem);
  }, [courses, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(courses.length / itemsPerPage);

  // Reset to first page when courses change
  useEffect(() => {
    setCurrentPage(1);
  }, [courses]);

  // Fetch initial data when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [offeringTypesRes, filtersRes] = await Promise.all([
          fetch(OFFERING_TYPES_URL),
          fetch(UNIQUE_VALUES_URL),
        ]);

        // Handle offering types
        if (!offeringTypesRes.ok)
          throw new Error("Failed to fetch offering types");
        const offeringTypesData = await offeringTypesRes.json();
        setOfferingTypes(offeringTypesData);

        // Handle filters
        if (!filtersRes.ok)
          throw new Error(`Failed to fetch filters: ${filtersRes.status}`);
        const filtersData = await filtersRes.json();

        // Build filters with offering types
        const transformed = [
          ...Object.keys(filtersData).map((key) => ({
            id: key,
            name: key.replace(/_/g, " "),
            options: filtersData[key],
          })),
          {
            id: "offering_type",
            name: "Source Database",
            options: offeringTypesData,
          },
        ];

        setFilters(transformed);

        // Fetch initial courses after filters are set
        fetchFilteredCourses();
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    };

    fetchInitialData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (filtersChanged) {
      fetchFilteredCourses();
      setFiltersChanged(false);
    }
  }, [filtersChanged]);

  // Prepare payload for filtered search
  const preparePayload = useCallback(() => {
    const payload: Record<string, any> = {};

    // Add search criteria
    if (searchQuery.trim()) {
      payload[searchBy] = searchQuery.trim();
    }

    // Add filters
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        // Special handling for rating
        if (key === "rating" && values[0]) {
          payload[key] = [`>=${values[0]}`];
        } else {
          payload[key] = values;
        }
      }
    });

    return payload;
  }, [searchQuery, searchBy, selectedFilters]);

  // Fetch filtered courses
  const fetchFilteredCourses = useCallback(async () => {
    try {
      setLoading(true);
      const payload = preparePayload();

      const response = await fetch(FILTERED_COURSES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Filter error:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [preparePayload]);

  // Handle filter changes
  const handleFilterChange = (filterId: string, value: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  // Apply filters and search
  const applyFilters = () => {
    setFiltersChanged(true);
  };

  // Reset filters and search
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedFilters({});
    setCurrentPage(1);
    setFiltersChanged(true);
  };

  // Pagination controls
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Render loading state
  if (loading && courses.length === 0) {
    return (
      <div className="flex align-items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-white">
        <InitialLoader />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <FilterSidebar
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
      />

      <motion.div
        className="w-full flex flex-col items-center p-4 ml-64 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full max-w-6xl flex items-center gap-4 mb-4">
          <div className="flex-1">
            <SearchBar
              searchQuery={searchQuery}
              searchBy={searchBy}
              onSearchChange={setSearchQuery}
              onSearchByChange={setSearchBy}
              onSearch={applyFilters}
            />
          </div>

          {/* Reset Filters Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <X size={18} />
            Reset Filters
          </motion.button>
        </div>

        {/* Results info */}
        <div className="flex justify-between items-center w-full max-w-6xl mb-4">
          <h2 className="text-sm md:text-base font-semibold text-gray-700">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, courses.length)} of {courses.length}{" "}
            courses
          </h2>

          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
          {loading ? (
            <AnimatePresence>
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <SkeletonCourseCard />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : currentCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-10"
            >
              <h3 className="text-lg font-medium text-gray-900">
                No courses found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {currentCourses.map((course, index) => (
                <motion.div
                  key={`${course.unique_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 120,
                  }}
                  layout
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show first, last, and pages around current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-full text-sm ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              }

              // Show ellipsis for gaps
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
