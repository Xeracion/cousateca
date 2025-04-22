
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
  Hammer,
  BookOpen,
  Camera,
  Gamepad,
  Shirt,
  Utensils,
  Brush
} from "lucide-react";

interface CategoryCardProps {
  category: Category | any;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  
  // Determine icon based on category name
  const getIconByName = (name: string) => {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('electrónica') || nameLower.includes('electronica')) {
      return <Laptop size={40} className="text-rental-500" />;
    } else if (nameLower.includes('deporte') || nameLower.includes('sport')) {
      return <Bike size={40} className="text-rental-500" />;
    } else if (nameLower.includes('aire libre') || nameLower.includes('camping') || nameLower.includes('outdoor')) {
      return <Tent size={40} className="text-rental-500" />;
    } else if (nameLower.includes('evento') || nameLower.includes('fiesta') || nameLower.includes('event')) {
      return <PartyPopper size={40} className="text-rental-500" />;
    } else if (nameLower.includes('música') || nameLower.includes('musica') || nameLower.includes('music')) {
      return <Music size={40} className="text-rental-500" />;
    } else if (nameLower.includes('herramienta') || nameLower.includes('tool')) {
      return <Hammer size={40} className="text-rental-500" />;
    } else if (nameLower.includes('libro') || nameLower.includes('book')) {
      return <BookOpen size={40} className="text-rental-500" />;
    } else if (nameLower.includes('foto') || nameLower.includes('cámara') || nameLower.includes('camera')) {
      return <Camera size={40} className="text-rental-500" />;
    } else if (nameLower.includes('juego') || nameLower.includes('game')) {
      return <Gamepad size={40} className="text-rental-500" />;
    } else if (nameLower.includes('ropa') || nameLower.includes('clothing')) {
      return <Shirt size={40} className="text-rental-500" />;
    } else if (nameLower.includes('cocina') || nameLower.includes('kitchen')) {
      return <Utensils size={40} className="text-rental-500" />;
    } else if (nameLower.includes('arte') || nameLower.includes('art')) {
      return <Brush size={40} className="text-rental-500" />;
    }
    
    // Map icon name from database if available
    if (category.icon) {
      switch (category.icon) {
        case "laptop": return <Laptop size={40} className="text-rental-500" />;
        case "bicycle": return <Bike size={40} className="text-rental-500" />;
        case "tent": return <Tent size={40} className="text-rental-500" />;
        case "party-popper": return <PartyPopper size={40} className="text-rental-500" />;
        case "music": return <Music size={40} className="text-rental-500" />;
        case "hammer": return <Hammer size={40} className="text-rental-500" />;
        case "book": return <BookOpen size={40} className="text-rental-500" />;
        case "camera": return <Camera size={40} className="text-rental-500" />;
        case "game": return <Gamepad size={40} className="text-rental-500" />;
        case "shirt": return <Shirt size={40} className="text-rental-500" />;
        case "kitchen": return <Utensils size={40} className="text-rental-500" />;
        case "art": return <Brush size={40} className="text-rental-500" />;
      }
    }
    
    // Default icon
    return <Laptop size={40} className="text-rental-500" />;
  };

  return (
    <Link to={`/category/${category.id}`}>
      <Card className="hover:shadow-md transition-shadow product-card h-full">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4">
            {getIconByName(category.nombre_es)}
          </div>
          <h3 className="font-medium text-lg mb-2">{category.nombre_es}</h3>
          <p className="text-sm text-gray-500">{category.descripcion_es}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
