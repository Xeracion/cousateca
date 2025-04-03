
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Laptop, Bike, Tent, PartyPopper, Music, Hammer } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sortOption, setSortOption] = useState<string>("featured");
  
  // Find the category
  const category = categories.find((cat) => cat.id === id);
  
  // Helper function to get the correct icon
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
  
  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Categoría no encontrada</h1>
            <p className="text-gray-600 mb-6">
              Lo sentimos, no pudimos encontrar la categoría que estás buscando.
            </p>
            <Link to="/categories">
              <Button className="bg-rental-500 hover:bg-rental-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Categorías
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get products for this category
  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === category.name.toLowerCase()
  );
  
  // Sort products based on selected sort option
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.dailyPrice - b.dailyPrice;
      case "price-high":
        return b.dailyPrice - a.dailyPrice;
      case "rating":
        return b.rating - a.rating;
      case "featured":
      default:
        return b.featured ? 1 : -1;
    }
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/categories" className="text-rental-500 hover:underline flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a todas las Categorías
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="bg-rental-50 p-4 rounded-full mr-6 mb-4 md:mb-0">
                {getIcon(category.icon)}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{category.nombre_es}</h1>
                <p className="text-gray-600">{category.descripcion_es}</p>
              </div>
            </div>
          </div>
          
          {/* Sort options */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              {sortedProducts.length} productos disponibles
            </p>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Ordenar por:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
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
          
          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                No hay productos disponibles en esta categoría aún.
              </p>
              <Link to="/products">
                <Button className="bg-rental-500 hover:bg-rental-600">
                  Explorar Todos los Productos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetail;
