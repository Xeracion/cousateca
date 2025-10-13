
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/data/products";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasImages = product.images && product.images.length > 0;
  const defaultImage = "https://via.placeholder.com/300x300?text=Sin+imagen";
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card className="overflow-hidden product-card h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img
          src={imageError ? defaultImage : (hasImages ? product.images[0] : defaultImage)}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`object-cover w-full h-full transition-all duration-300 hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-rental-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Destacado
          </div>
        )}
      </div>
      <CardContent className="flex-grow pt-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.category}</p>
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {product.shortDescription}
        </p>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-rental-500" />
          <div>
            <p className="font-bold text-lg">{formatCurrency(product.dailyPrice)}</p>
            <p className="text-xs text-gray-500">por día</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link to={`/product/${product.id}`} className="w-full">
          <Button className="w-full bg-rental-500 hover:bg-rental-600">
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
