
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/data/products";
import { 
  Calendar as CalendarIcon, 
  Star, 
  ChevronRight, 
  Truck, 
  Shield, 
  DollarSign,
  Clock
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { 
  calculateTotalPrice, 
  formatCurrency, 
  formatDate, 
  getDefaultEndDate 
} from "@/lib/utils";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = getProductById(id || "");
  
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(getDefaultEndDate(new Date()));
  const [activeImage, setActiveImage] = useState(0);
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Button onClick={() => navigate("/products")}>
              Browse All Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const rentalDays = calculateTotalPrice(1, startDate, endDate) / product.dailyPrice;
  const totalPrice = calculateTotalPrice(product.dailyPrice, startDate, endDate);
  
  const handleAddToCart = () => {
    if (!product.availability) {
      toast.error("This product is currently unavailable");
      return;
    }
    
    addToCart({
      product,
      rentalDays,
      startDate,
      endDate,
    });
    
    navigate("/cart");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-rental-500">Home</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <a href="/products" className="hover:text-rental-500">Products</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-lg overflow-hidden mb-4">
                <Carousel>
                  <CarouselContent>
                    {product.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${product.name} - Image ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      activeImage === index ? "border-rental-500" : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Info and Rental Options */}
            <div>
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span className="text-gray-500 ml-1">
                    ({product.reviewCount} reviews)
                  </span>
                  <Separator orientation="vertical" className="mx-3 h-5" />
                  <span className="text-gray-700">{product.category}</span>
                </div>
                
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                <Tabs defaultValue="daily">
                  <TabsList className="mb-4">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily" className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-rental-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {formatCurrency(product.dailyPrice)} / day
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Perfect for short-term needs or trying before you buy.
                    </p>
                  </TabsContent>
                  <TabsContent value="weekly" className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-rental-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {formatCurrency(product.weeklyPrice)} / week
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Save {Math.round((1 - (product.weeklyPrice / (product.dailyPrice * 7))) * 100)}% compared to daily rates.
                    </p>
                  </TabsContent>
                  <TabsContent value="monthly" className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-rental-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {formatCurrency(product.monthlyPrice)} / month
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Save {Math.round((1 - (product.monthlyPrice / (product.dailyPrice * 30))) * 100)}% compared to daily rates.
                    </p>
                  </TabsContent>
                </Tabs>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="font-medium mb-2">Start Date</p>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          // Ensure end date is after start date
                          if (date > endDate) {
                            setEndDate(getDefaultEndDate(date));
                          }
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      className="border rounded-md p-3"
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2">End Date</p>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      disabled={(date) => date < startDate}
                      className="border rounded-md p-3"
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Duration:</span>
                    <span className="font-medium">{rentalDays} days</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Dates:</span>
                    <span className="font-medium">
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Daily Rate:</span>
                    <span className="font-medium">{formatCurrency(product.dailyPrice)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Security Deposit:</span>
                    <span className="font-medium">{formatCurrency(product.deposit)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Security deposit is refundable upon return in good condition.
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-rental-500 hover:bg-rental-600"
                  disabled={!product.availability}
                  onClick={handleAddToCart}
                >
                  {product.availability ? "Add to Cart" : "Currently Unavailable"}
                </Button>
              </div>
              
              {/* Additional Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Truck className="h-8 w-8 text-rental-500 mr-3" />
                    <div>
                      <h3 className="font-medium">Fast Delivery</h3>
                      <p className="text-sm text-gray-600">Within 24 hours</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Shield className="h-8 w-8 text-rental-500 mr-3" />
                    <div>
                      <h3 className="font-medium">Insured Items</h3>
                      <p className="text-sm text-gray-600">Safe & protected</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Clock className="h-8 w-8 text-rental-500 mr-3" />
                    <div>
                      <h3 className="font-medium">Flexible Terms</h3>
                      <p className="text-sm text-gray-600">Easy extensions</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
