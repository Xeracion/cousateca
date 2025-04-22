
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import { categories as defaultCategories } from "@/data/categories";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('nombre');
          
        if (error) throw error;
        if (data) setDbCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Use database categories if available, otherwise fallback to static data
  const categoriesToDisplay = dbCategories.length > 0 
    ? dbCategories.map(cat => ({
        id: cat.id,
        name: cat.nombre_es, // Use Spanish name
        nombre_es: cat.nombre_es,
        icon: cat.icon || "laptop", // Fallback icon
        description: cat.descripcion_es || "", // Use Spanish description
        descripcion_es: cat.descripcion_es || ""
      }))
    : defaultCategories;

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
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
            ))
          ) : (
            categoriesToDisplay.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
