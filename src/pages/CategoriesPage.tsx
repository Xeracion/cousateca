
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { Laptop, Bike, Tent, PartyPopper, Music, Hammer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/categories";
import { products as staticProducts, Product } from "@/data/products";

const CategoriesPage = () => {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('nombre');
          
        // Fetch products
        const { data: productsData } = await supabase
          .from('productos')
          .select('*');
          
        if (categoriesData) setDbCategories(categoriesData);
        if (productsData) setDbProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Helper function to get the correct icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "laptop":
        return <Laptop className="h-6 w-6 text-rental-500" />;
      case "bicycle":
        return <Bike className="h-6 w-6 text-rental-500" />;
      case "tent":
        return <Tent className="h-6 w-6 text-rental-500" />;
      case "party-popper":
        return <PartyPopper className="h-6 w-6 text-rental-500" />;
      case "music":
        return <Music className="h-6 w-6 text-rental-500" />;
      case "hammer":
        return <Hammer className="h-6 w-6 text-rental-500" />;
      default:
        return <Laptop className="h-6 w-6 text-rental-500" />;
    }
  };

  // Helper function to map DB product to frontend product schema
  const mapProductData = (product: any): Product => {
    return {
      id: product.id,
      name: product.nombre || product.name || "",
      category: product.categoria?.nombre || product.category || "",
      description: product.descripcion || "",
      shortDescription: product.descripcion_corta || "",
      dailyPrice: product.precio_diario || 0,
      deposit: product.deposito || 0,
      images: product.imagenes || product.images || [],
      availability: product.disponible !== false,
      featured: product.destacado === true,
      rating: product.valoracion || 0,
      reviewCount: product.num_valoraciones || 0
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-10 flex justify-center items-center">
          <p>Cargando categorías...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Categorías de Productos</h1>
          
          <p className="text-gray-600 max-w-3xl mb-12">
            Navega por nuestra extensa gama de productos para alquilar, organizados por categoría. 
            Desde electrónica hasta equipamiento para exteriores, tenemos artículos de alta calidad que se adaptan a tus necesidades.
          </p>
          
          {categories.map((category) => {
            // Get products for this category from database or fallback to static data
            const categoryProducts = dbProducts.length > 0 
              ? dbProducts.filter(product => product.categoria_id === category.id)
              : staticProducts.filter(product => product.category.toLowerCase() === category.name.toLowerCase());
            
            return (
              <section key={category.id} className="mb-16 last:mb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-rental-50 p-3 rounded-full mr-4">
                      {getIcon(category.icon)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.nombre_es}</h2>
                      <p className="text-gray-600">{category.descripcion_es}</p>
                    </div>
                  </div>
                  <Link to={`/category/${category.id}`}>
                    <Button variant="outline" className="border-rental-500 text-rental-500 hover:bg-rental-50">
                      Ver Todos los {category.nombre_es}
                    </Button>
                  </Link>
                </div>
                
                {categoryProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={mapProductData(product)} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">
                      Aún no hay productos disponibles en esta categoría.
                    </p>
                    <Link to="/products">
                      <Button className="bg-rental-500 hover:bg-rental-600">
                        Explorar Todos los Productos
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
