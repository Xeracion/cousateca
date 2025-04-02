
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { Laptop, Bike, Tent, PartyPopper, Music, Hammer } from "lucide-react";

const CategoriesPage = () => {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
          
          <p className="text-gray-600 max-w-3xl mb-12">
            Browse our extensive range of rental products organized by category. 
            From electronics to outdoor gear, we have high-quality items to suit your needs.
          </p>
          
          {categories.map((category) => {
            // Get products for this category
            const categoryProducts = products.filter(
              (product) => product.category.toLowerCase() === category.name.toLowerCase()
            );
            
            return (
              <section key={category.id} className="mb-16 last:mb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-rental-50 p-3 rounded-full mr-4">
                      {getIcon(category.icon)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <Link to={`/category/${category.id}`}>
                    <Button variant="outline" className="border-rental-500 text-rental-500 hover:bg-rental-50">
                      View All {category.name}
                    </Button>
                  </Link>
                </div>
                
                {categoryProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.slice(0, 4).map((product) => (
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
