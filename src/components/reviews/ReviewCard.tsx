
import React from "react";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    name: string;
    role?: string;
    content: string;
    rating: number;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic">"{review.content}"</p>
      <div className="flex items-center">
        <div>
          <h4 className="font-semibold">{review.name}</h4>
          {review.role && <p className="text-sm text-gray-600">{review.role}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
