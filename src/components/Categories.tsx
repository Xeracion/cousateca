
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/categories";

const Categories = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Explora categorías</h2>
            <p className="text-gray-600">Encuentra los productos perfectos para tus necesidades</p>
          </div>
          <Link to="/categories">
            <Button variant="outline" className="mt-4 md:mt-0 border-rental-500 text-rental-500 hover:bg-rental-50">
              Todas las categorías
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
