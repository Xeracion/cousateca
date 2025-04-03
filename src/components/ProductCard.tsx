
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    nombre: string;
    descripcion_corta?: string;
    precio_diario: number;
    imagenes: string[];
    destacado?: boolean;
    categoria?: {
      nombre: string;
    };
    // Campos para compatibilidad con la estructura antigua (datos estáticos)
    name?: string;
    shortDescription?: string;
    dailyPrice?: number;
    images?: string[];
    featured?: boolean;
    category?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Compatibilidad con ambas estructuras de datos
  const nombre = product.nombre || product.name || '';
  const descripcionCorta = product.descripcion_corta || product.shortDescription || '';
  const precioDiario = product.precio_diario || product.dailyPrice || 0;
  const imagenes = product.imagenes || product.images || [];
  const destacado = product.destacado || product.featured || false;
  const categoria = product.categoria?.nombre || product.category || '';

  return (
    <Card className="overflow-hidden product-card h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imagenes[0]}
          alt={nombre}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        {destacado && (
          <div className="absolute top-2 left-2 bg-rental-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Destacado
          </div>
        )}
      </div>
      <CardContent className="flex-grow pt-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{nombre}</h3>
        <p className="text-gray-500 text-sm mb-2">{categoria}</p>
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {descripcionCorta}
        </p>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-rental-500" />
          <div>
            <p className="font-bold text-lg">{formatCurrency(precioDiario)}</p>
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
