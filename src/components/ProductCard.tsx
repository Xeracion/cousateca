
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden product-card h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
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
