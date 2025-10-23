
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { Calendar, Clock, MapPin, Phone, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Definir la interfaz para las reservas
interface Reserva {
  id: string;
  usuario_id: string;
  producto_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: number;
  estado: string;
  created_at: string;
  producto: {
    nombre: string;
    imagenes: string[];
    descripcion_corta: string;
  };
}

// Definir la interfaz para el perfil
interface Perfil {
  id: string;
  nombre: string | null;
  telefono: string | null;
  direccion: string | null;
}

const UserProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: ""
  });

  // Cargar usuario y verificar si está autenticado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/auth");
        return;
      }
      setUser(data.user);
      loadUserData(data.user.id);
    };
    
    checkUser();
    
    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session?.user) {
          setUser(session.user);
          loadUserData(session.user.id);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Cargar datos del usuario (perfil y reservas)
  const loadUserData = async (userId: string) => {
    setLoading(true);
    try {
      console.log('Loading user data for:', userId);
      
      // Cargar perfil
      const { data: perfilData, error: perfilError } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (perfilError) {
        console.error('Error loading profile:', perfilError);
        throw perfilError;
      }
      console.log('Profile loaded:', perfilData);
      setPerfil(perfilData);
      setFormData({
        nombre: perfilData.nombre || "",
        telefono: perfilData.telefono || "",
        direccion: perfilData.direccion || ""
      });
      
      // Cargar reservas
      console.log('Loading reservations...');
      const { data: reservasData, error: reservasError } = await supabase
        .from("reservas")
        .select(`
          *,
          producto:producto_id (
            nombre,
            imagenes,
            descripcion_corta
          )
        `)
        .eq("usuario_id", userId)
        .order("created_at", { ascending: false });
      
      if (reservasError) {
        console.error('Error loading reservations:', reservasError);
        throw reservasError;
      }
      console.log('Reservations loaded:', reservasData?.length || 0);
      setReservas(reservasData);
    } catch (error: any) {
      console.error('Error in loadUserData:', error);
      toast({
        title: "Error al cargar datos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar actualización de perfil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("perfiles")
        .update(formData)
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Perfil actualizado",
        description: "Los datos de tu perfil se han actualizado correctamente."
      });
      
      // Actualizar perfil local
      setPerfil({
        ...perfil!,
        ...formData
      });
    } catch (error: any) {
      toast({
        title: "Error al actualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Manejar cambio en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar cierre de sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Mostrar estado de reserva con el color adecuado
  const renderEstadoReserva = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case "confirmada":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmada</Badge>;
      case "activa":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Activa</Badge>;
      case "completada":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Completada</Badge>;
      case "cancelada":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl">Cargando datos...</h2>
          </div>
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
          <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>
          
          <Tabs defaultValue="reservas" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="reservas" className="flex-1">Mis Reservas</TabsTrigger>
              <TabsTrigger value="perfil" className="flex-1">Mi Perfil</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reservas">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Reservas</CardTitle>
                    <CardDescription>
                      Aquí puedes ver todas tus reservas y su estado actual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reservas.length > 0 ? (
                      <div className="space-y-6">
                        {reservas.map((reserva) => (
                          <div key={reserva.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="w-full md:w-1/4">
                                <img 
                                  src={reserva.producto.imagenes[0]} 
                                  alt={reserva.producto.nombre}
                                  className="w-full h-40 object-cover rounded-md"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-lg font-semibold">{reserva.producto.nombre}</h3>
                                  {renderEstadoReserva(reserva.estado)}
                                </div>
                                <p className="text-gray-600 mt-1 mb-3">{reserva.producto.descripcion_corta}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>
                                      Desde: {format(new Date(reserva.fecha_inicio), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>
                                      Hasta: {format(new Date(reserva.fecha_fin), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>
                                      Solicitado: {format(new Date(reserva.created_at), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <p className="font-semibold text-lg">
                                    Precio total: ${reserva.precio_total.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Aún no tienes reservas realizadas</p>
                        <Button 
                          className="bg-rental-500 hover:bg-rental-600"
                          onClick={() => navigate("/products")}
                        >
                          Explorar Productos
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="perfil">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información de la Cuenta</CardTitle>
                      <CardDescription>
                        Detalles básicos de tu cuenta
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-rental-100 rounded-full p-2">
                            <UserIcon className="h-5 w-5 text-rental-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                        </div>
                        <Separator />
                        <Button 
                          variant="outline" 
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          Cerrar Sesión
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Perfil Personal</CardTitle>
                      <CardDescription>
                        Actualiza tu información de contacto
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="nombre"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleInputChange}
                              className="pl-9"
                              placeholder="Tu nombre completo"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="telefono"
                              name="telefono"
                              value={formData.telefono || ""}
                              onChange={handleInputChange}
                              className="pl-9"
                              placeholder="Tu número de teléfono"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="direccion">Dirección</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="direccion"
                              name="direccion"
                              value={formData.direccion || ""}
                              onChange={handleInputChange}
                              className="pl-9"
                              placeholder="Tu dirección"
                            />
                          </div>
                        </div>
                        
                        <Button type="submit" className="w-full bg-rental-500 hover:bg-rental-600">
                          Guardar Cambios
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
