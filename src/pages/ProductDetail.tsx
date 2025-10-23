
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ChevronRight, Truck, Shield, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency, formatDate, getDefaultEndDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { format, addDays, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: getDefaultEndDate(new Date())
  });
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
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
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (error: any) {
        console.error("Error al cargar el producto:", error);
        toast.error("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
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
      </div>
    );
  }

  // Calcular la duración del alquiler en días
  const rentalDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 1;

  // Calcular el precio total (solo precio diario)
  const totalPrice = dateRange?.from && dateRange?.to ? product.precio_diario * rentalDays : product.precio_diario;

  const handleAddToCart = () => {
    if (!product.disponible) {
      toast.error("Este producto no está disponible actualmente");
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Por favor selecciona fechas de inicio y fin");
      return;
    }
    
    // Map the Supabase product to the Product interface format
    const mappedProduct = {
      id: product.id,
      name: product.nombre,
      category: product.categoria?.nombre || '',
      description: product.descripcion || '',
      shortDescription: product.descripcion_corta || '',
      dailyPrice: product.precio_diario || 0,
      deposit: product.deposito || 0,
      images: product.imagenes || [],
      availability: product.disponible,
      featured: product.destacado || false,
      rating: product.valoracion || 0,
      reviewCount: product.num_valoraciones || 0
    };
    
    addToCart({
      product: mappedProduct,
      rentalDays,
      startDate: dateRange.from,
      endDate: dateRange.to
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
            <a href="/" className="hover:text-rental-500">Inicio</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <a href="/products" className="hover:text-rental-500">Productos</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{product.nombre}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-lg overflow-hidden mb-4">
                <Carousel>
                  <CarouselContent>
                    {product.imagenes.map((image: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square overflow-hidden">
                          <img src={image} alt={`${product.nombre} - Imagen ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div className="flex space-x-2">
                {product.imagenes.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${activeImage === index ? "border-rental-500" : "border-transparent"}`} 
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image} alt={`Miniatura ${index + 1}`} className="w-16 h-16 object-cover" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Info and Rental Options */}
            <div>
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{product.nombre}</h1>
                <p className="text-gray-700 mb-4">{product.categoria?.nombre || 'Categoría no disponible'}</p>
                
                <p className="text-gray-700 mb-6">{product.descripcion}</p>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">
                      {formatCurrency(product.precio_diario)} / día
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Precio fijo por día de alquiler.
                  </p>
                </div>
                
                <Separator className="my-6" />
                
                <div className="mb-6">
                  <p className="font-medium mb-4">Selecciona fechas de alquiler</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fecha de recogida */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Fecha de recogida</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              format(dateRange.from, "d MMM, yyyy", { locale: es })
                            ) : (
                              <span>Selecciona fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange?.from}
                            onSelect={(date) => {
                              if (date) {
                                setDateRange({ from: date, to: dateRange?.to });
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Fecha de devolución */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Fecha de devolución</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal"
                            disabled={!dateRange?.from}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.to ? (
                              format(dateRange.to, "d MMM, yyyy", { locale: es })
                            ) : (
                              <span>Selecciona fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange?.to}
                            onSelect={(date) => {
                              if (date && dateRange?.from) {
                                setDateRange({ from: dateRange.from, to: date });
                              }
                            }}
                            disabled={(date) => {
                              if (!dateRange?.from) return true;
                              return date <= dateRange.from;
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Duración:</span>
                    <span className="font-medium">{rentalDays} días</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Fechas:</span>
                    <span className="font-medium">
                      {dateRange?.from && dateRange?.to ? (
                        <>
                          {format(dateRange.from, "d MMM, yyyy", { locale: es })} - {format(dateRange.to, "d MMM, yyyy", { locale: es })}
                        </>
                      ) : (
                        "No seleccionado"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Precio por día:</span>
                    <span className="font-medium">{formatCurrency(product.precio_diario)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Depósito de Seguridad:</span>
                    <span className="font-medium">{formatCurrency(product.deposito)}</span>
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
                
                <Button 
                  className="w-full bg-rental-500 hover:bg-rental-600" 
                  disabled={!product.disponible} 
                  onClick={handleAddToCart}
                >
                  {product.disponible ? "Añadir al Carrito" : "Actualmente No Disponible"}
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
    </div>
  );
};

export default ProductDetail;
