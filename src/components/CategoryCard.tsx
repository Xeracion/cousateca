
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/data/categories";
import { 
  Laptop, 
  Bike,
  Tent, 
  PartyPopper, 
  Music, 
  Hammer
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  
  // Map category icons to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "laptop":
        return <Laptop size={40} className="text-rental-500" />;
      case "bicycle":
        return <Bike size={40} className="text-rental-500" />;
      case "tent":
        return <Tent size={40} className="text-rental-500" />;
      case "party-popper":
        return <PartyPopper size={40} className="text-rental-500" />;
      case "music":
        return <Music size={40} className="text-rental-500" />;
      case "hammer":
        return <Hammer size={40} className="text-rental-500" />;
      default:
        return <Laptop size={40} className="text-rental-500" />;
    }
  };

  return (
    <Link to={`/category/${category.id}`}>
      <Card className="hover:shadow-md transition-shadow product-card h-full">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4">
            {getIcon(category.icon)}
          </div>
          <h3 className="font-medium text-lg mb-2">{category.nombre_es}</h3>
          <p className="text-sm text-gray-500">{category.descripcion_es}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
