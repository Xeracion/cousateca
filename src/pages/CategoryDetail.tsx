
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Laptop, Bike, Tent, PartyPopper, Music, Hammer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CategoryDetail = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 1000});
  const [sortOrder, setSortOrder] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  const category = categories.find(c => c.id === id);
  
  // Function to get filtered and sorted products
  const getFilteredProducts = () => {
    return products
      .filter(product => product.category.toLowerCase() === category?.name.toLowerCase())
      .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(product => product.dailyPrice >= priceRange.min && product.dailyPrice <= priceRange.max)
      .sort((a, b) => {
        if (sortOrder === "price-asc") return a.dailyPrice - b.dailyPrice;
        if (sortOrder === "price-desc") return b.dailyPrice - a.dailyPrice;
        return b.featured ? 1 : -1; // Featured first by default
      });
  };
  
  const filteredProducts = getFilteredProducts();
  
  // Helper function to get the right icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "laptop":
        return <Laptop className="h-8 w-8 text-rental-500" />;
      case "bicycle":
        return <Bike className="h-8 w-8 text-rental-500" />;
      case "tent":
        return <Tent className="h-8 w-8 text-rental-500" />;
      case "party-popper":
        return <PartyPopper className="h-8 w-8 text-rental-500" />;
      case "music":
        return <Music className="h-8 w-8 text-rental-500" />;
      case "hammer":
        return <Hammer className="h-8 w-8 text-rental-500" />;
      default:
        return <Laptop className="h-8 w-8 text-rental-500" />;
    }
  };
  
  // Helper function to map DB product to frontend product schema
  const mapProductData = (product: any) => {
    return {
      id: product.id,
      nombre: product.nombre,
      descripcion_corta: product.descripcion_corta,
      precio_diario: product.precio_diario,
      imagenes: product.imagenes,
      destacado: product.destacado,
      categoria_id: product.categoria_id,
      // Also include legacy format for compatibility
      name: product.nombre,
      shortDescription: product.descripcion_corta,
      dailyPrice: product.precio_diario,
      images: product.imagenes,
      featured: product.destacado,
      category: product.categoria_id
    };
  };

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
        
        // Find maximum price for range slider
        if (productsData && productsData.length > 0) {
          const max = Math.max(...productsData.map((p: any) => p.precio_diario));
          setMaxPrice(max);
          setPriceRange({min: 0, max});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
            <p className="mb-6">Lo sentimos, la categoría que estás buscando no existe.</p>
            <Button className="bg-rental-500 hover:bg-rental-600" onClick={() => window.history.back()}>
              Volver Atrás
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Cargando productos...</p>
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
          <div className="flex items-center mb-8">
            <div className="bg-rental-50 p-4 rounded-full mr-5">
              {getIcon(category.icon)}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{category.nombre_es}</h1>
              <p className="text-gray-600 max-w-3xl">{category.descripcion_es}</p>
            </div>
          </div>
          
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              {/* Search input */}
              <div className="flex-grow">
                <Label htmlFor="search">Buscar productos</Label>
                <Input 
                  id="search" 
                  placeholder="Buscar por nombre" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Price range filter */}
              <div className="w-full md:w-48">
                <Label htmlFor="price-range">Precio máximo: {priceRange.max} €</Label>
                <Input 
                  id="price-range" 
                  type="range" 
                  min="0" 
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              {/* Sort order */}
              <div className="w-full md:w-64">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        {sortOrder === "featured" && "Destacados primero"}
                        {sortOrder === "price-asc" && "Precio: menor a mayor"}
                        {sortOrder === "price-desc" && "Precio: mayor a menor"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setSortOrder("featured")}>
                      Destacados primero
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("price-asc")}>
                      Precio: menor a mayor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("price-desc")}>
                      Precio: mayor a menor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={mapProductData(product)} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-4">No se encontraron productos</h2>
              <p className="text-gray-600 mb-6">
                No hay productos que coincidan con los criterios de búsqueda.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange({min: 0, max: maxPrice});
                  setSortOrder("featured");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetail;
