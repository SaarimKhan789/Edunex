import React from "react";
import { Star } from "lucide-react";

interface RatingCardProps {
  rating: number;
  maxRating?: number;
}

export const RatingCard: React.FC<RatingCardProps> = ({ rating, maxRating = 5 }) => {
  const stars = Array.from({ length: maxRating }, (_, index) => (
    <Star key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"} />
  ));

  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-2 text-gray-600">{rating}/{maxRating}</span>
    </div>
  );
};