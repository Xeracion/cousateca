
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import { categories as defaultCategories } from "@/data/categories";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Categories = () => {
  const { toast } = useToast();
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Cargando categorías...");
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('nombre');
          
        if (error) {
          console.error("Error al cargar categorías:", error);
          throw error;
        }
        
        console.log("Categorías cargadas:", data);
        setDbCategories(data || []);
        
      } catch (error: any) {
        console.error("Error detallado al cargar categorías:", error);
        setError(error.message);
        toast({
          title: "Error al cargar categorías",
          description: "Usando categorías por defecto. " + error.message,
          variant: "destructive"
        });
        // En caso de error, usar categorías por defecto
        setDbCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

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

  if (error && dbCategories.length === 0 && defaultCategories.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Error al cargar categorías</h2>
            <p className="text-gray-600 mb-4">No se pudieron cargar las categorías. Por favor, inténtalo de nuevo.</p>
            <Button onClick={() => window.location.reload()}>
              Recargar página
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))
          ) : (
            categoriesToDisplay.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
        
        {error && dbCategories.length === 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-orange-600">
              Mostrando categorías por defecto debido a un error de conexión
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
