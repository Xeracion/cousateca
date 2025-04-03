import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/data/products";
import { Calendar as CalendarIcon, ChevronRight, Truck, Shield, DollarSign, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { calculateTotalPrice, formatCurrency, formatDate, getDefaultEndDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { format, addDays, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
const ProductDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    addToCart
  } = useCart();
  const product = getProductById(id || "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: getDefaultEndDate(new Date())
  });
  const [activeImage, setActiveImage] = useState(0);
  if (!product) {
    return <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Producto No Encontrado</h1>
            <p className="mb-6">Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
            <Button onClick={() => navigate("/products")}>
              Explorar Todos los Productos
            </Button>
          </div>
        </main>
        <Footer />
      </div>;
  }

  // Calcular la duración del alquiler en días
  const rentalDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 1;

  // Calcular el precio total
  const totalPrice = dateRange?.from && dateRange?.to ? product.dailyPrice * rentalDays : product.dailyPrice;
  const handleAddToCart = () => {
    if (!product.availability) {
      toast.error("Este producto no está disponible actualmente");
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Por favor selecciona fechas de inicio y fin");
      return;
    }
    addToCart({
      product,
      rentalDays,
      startDate: dateRange.from,
      endDate: dateRange.to
    });
    navigate("/cart");
  };
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-rental-500">Inicio</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <a href="/products" className="hover:text-rental-500">Productos</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-lg overflow-hidden mb-4">
                <Carousel>
                  <CarouselContent>
                    {product.images.map((image, index) => <CarouselItem key={index}>
                        <div className="aspect-square overflow-hidden">
                          <img src={image} alt={`${product.name} - Imagen ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      </CarouselItem>)}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div className="flex space-x-2">
                {product.images.map((image, index) => <div key={index} className={`cursor-pointer border-2 rounded-md overflow-hidden ${activeImage === index ? "border-rental-500" : "border-transparent"}`} onClick={() => setActiveImage(index)}>
                    <img src={image} alt={`Miniatura ${index + 1}`} className="w-16 h-16 object-cover" />
                  </div>)}
              </div>
            </div>
            
            {/* Product Info and Rental Options */}
            <div>
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-gray-700 mb-4">{product.category}</p>
                
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                <Tabs defaultValue="daily">
                  <TabsList className="mb-4">
                    <TabsTrigger value="daily">Diario</TabsTrigger>
                    <TabsTrigger value="weekly">Semanal</TabsTrigger>
                    <TabsTrigger value="monthly">Mensual</TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily" className="space-y-4">
                    <div className="flex items-center">
                      
                      <span className="text-2xl font-bold">
                        {formatCurrency(product.dailyPrice)} / día
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Perfecto para necesidades a corto plazo o para probar antes de comprar.
                    </p>
                  </TabsContent>
                  <TabsContent value="weekly" className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-rental-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {formatCurrency(product.weeklyPrice)} / semana
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ahorra {Math.round((1 - product.weeklyPrice / (product.dailyPrice * 7)) * 100)}% en comparación con las tarifas diarias.
                    </p>
                  </TabsContent>
                  <TabsContent value="monthly" className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-rental-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {formatCurrency(product.monthlyPrice)} / mes
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ahorra {Math.round((1 - product.monthlyPrice / (product.dailyPrice * 30)) * 100)}% en comparación con las tarifas diarias.
                    </p>
                  </TabsContent>
                </Tabs>
                
                <Separator className="my-6" />
                
                <div className="mb-6">
                  <p className="font-medium mb-2">Selecciona fechas de alquiler</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? dateRange.to ? <>
                              {format(dateRange.from, "d MMM, yyyy", {
                          locale: es
                        })} -{" "}
                              {format(dateRange.to, "d MMM, yyyy", {
                          locale: es
                        })}
                            </> : format(dateRange.from, "d MMM, yyyy", {
                        locale: es
                      }) : <span>Selecciona fechas de alquiler</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} disabled={date => date < new Date()} />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Duración:</span>
                    <span className="font-medium">{rentalDays} días</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Fechas:</span>
                    <span className="font-medium">
                      {dateRange?.from && dateRange?.to ? <>
                          {format(dateRange.from, "d MMM, yyyy", {
                        locale: es
                      })} - {format(dateRange.to, "d MMM, yyyy", {
                        locale: es
                      })}
                        </> : "No seleccionado"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Tarifa Diaria:</span>
                    <span className="font-medium">{formatCurrency(product.dailyPrice)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Depósito de Seguridad:</span>
                    <span className="font-medium">{formatCurrency(product.deposit)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    El depósito de seguridad es reembolsable al devolverse en buenas condiciones.
                  </p>
                </div>
                
                <Button className="w-full bg-rental-500 hover:bg-rental-600" disabled={!product.availability} onClick={handleAddToCart}>
                  {product.availability ? "Añadir al Carrito" : "Actualmente No Disponible"}
                </Button>
              </div>
              
              {/* Additional Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Truck className="h-8 w-8 text-rental-500 mr-3" />
                    <div>
                      <h3 className="font-medium">Recogida rápida</h3>
                      <p className="text-sm text-gray-600">En 24 horas</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Shield className="h-8 w-8 text-rental-500 mr-3" />
                    <div>
                      <h3 className="font-medium">Artículos asegurados</h3>
                      <p className="text-sm text-gray-600">Seguros y protegidos</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Clock className="h-8 w-8 text-rental-500 mr-3" />
                    <div>
                      <h3 className="font-medium">Términos flexibles</h3>
                      <p className="text-sm text-gray-600">Extensiones fáciles</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default ProductDetail;