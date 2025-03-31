
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sortOption, setSortOption] = useState<string>("featured");
  
  // Find the category
  const category = categories.find((cat) => cat.id === id);
  
  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Category Not Found</h1>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the category you're looking for.
            </p>
            <Link to="/categories">
              <Button className="bg-rental-500 hover:bg-rental-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
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
              Back to All Categories
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="bg-rental-50 p-4 rounded-full mr-6 mb-4 md:mb-0">
                {/* We'll reuse the icon mapping logic */}
                {(() => {
                  const iconMapping = {
                    laptop: <img src="https://api.iconify.design/lucide:laptop.svg" alt="Laptop" className="h-8 w-8 text-rental-500" />,
                    bicycle: <img src="https://api.iconify.design/lucide:bicycle.svg" alt="Bicycle" className="h-8 w-8 text-rental-500" />,
                    tent: <img src="https://api.iconify.design/lucide:tent.svg" alt="Tent" className="h-8 w-8 text-rental-500" />,
                    "party-popper": <img src="https://api.iconify.design/lucide:party-popper.svg" alt="Party Popper" className="h-8 w-8 text-rental-500" />,
                    music: <img src="https://api.iconify.design/lucide:music.svg" alt="Music" className="h-8 w-8 text-rental-500" />,
                    hammer: <img src="https://api.iconify.design/lucide:hammer.svg" alt="Hammer" className="h-8 w-8 text-rental-500" />,
                  };
                  return iconMapping[category.icon] || iconMapping.laptop;
                })()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          </div>
          
          {/* Sort options */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              {sortedProducts.length} products available
            </p>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Sort by:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
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
                No products available in this category yet.
              </p>
              <Link to="/products">
                <Button className="bg-rental-500 hover:bg-rental-600">
                  Browse All Products
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
