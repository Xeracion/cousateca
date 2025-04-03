
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Productos destacados</h2>
            <p className="text-gray-600">Artículos de alta calidad disponibles para alquilar</p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="mt-4 md:mt-0 border-rental-500 text-rental-500 hover:bg-rental-50">
              Ver todos los productos
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
