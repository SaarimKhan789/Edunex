export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Course {
  unique_id: BigInteger;
  course_title: string;
  description: string;
  tutor_name: string;
  location: string;
  thumbnail: string;
  category: string;
  level: string;
  platform_name: string;
  duration: string;
  rating: number | null; // Adjusted for nullable rating
  enrolled: number;
  mode: string; // Added for course mode (online, remote, etc.)
  certifications: string; // Added for certifications
  difficulty_level: string; // Added for difficulty level
  price: string; // Added for price (e.g., free)
  num_enrollments: number; // Added for number of enrollments
}

export interface Filter {
  id: string;
  name: string;
  options: string[];
}
