
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/categories";
import { Sliders, Search } from "lucide-react";

interface Product {
  id: string;
  nombre: string;
  categoria_id: string;
  descripcion: string;
  descripcion_corta: string;
  precio_diario: number;
  precio_semanal: number;
  precio_mensual: number;
  deposito: number;
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
  valoracion: number;
  num_valoraciones: number;
  categoria?: {
    id: string;
    nombre: string;
  };
}

const ProductsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Cargar productos y categorías de Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar categorías
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, nombre');
        
        if (categoriesError) throw categoriesError;
        setDbCategories(categoriesData || []);
        
        // Cargar productos con categorías
        const { data: productsData, error: productsError } = await supabase
          .from('productos')
          .select(`
            *,
            categoria:categoria_id (
              id,
              nombre
            )
          `)
          .eq('disponible', true);
        
        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (error: any) {
        toast({
          title: "Error al cargar datos",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Filtrar productos basado en búsqueda y categoría
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descripcion_corta.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      (product.categoria && product.categoria.id === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Ordenar productos según el criterio seleccionado
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.precio_diario - b.precio_diario;
      case "price-high":
        return b.precio_diario - a.precio_diario;
      case "rating":
        return b.valoracion - a.valoracion;
      case "featured":
      default:
        return b.destacado ? 1 : -1;
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Todos los Productos</h1>
          
          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                
                <div className="hidden md:flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todas las Categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las Categorías</SelectItem>
                      {dbCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar Por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destacados</SelectItem>
                      <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                      <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                      <SelectItem value="rating">Mejor Valorados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Mobile filters */}
            {showFilters && (
              <div className="mt-4 md:hidden grid grid-cols-2 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las Categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Categorías</SelectItem>
                    {dbCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar Por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destacados</SelectItem>
                    <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="rating">Mejor Valorados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-gray-600">
                Intenta ajustar tu búsqueda o filtros para encontrar lo que estás buscando.
              </p>
              <Button 
                className="mt-4 bg-rental-500 hover:bg-rental-600"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
