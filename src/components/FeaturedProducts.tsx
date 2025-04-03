
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";

const FeaturedProducts = () => {
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select(`
            *,
            categoria:categoria_id (
              id,
              nombre
            )
          `)
          .eq('destacado', true)
          .eq('disponible', true)
          .limit(6);
        
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error: any) {
        console.error("Error al cargar productos destacados:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos destacados",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, [toast]);
  
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
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando productos destacados...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos destacados disponibles actualmente.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
