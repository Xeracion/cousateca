
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Menu, X, User, Calendar, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { itemCount } = useCart();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Verificar si el usuario está autenticado y si es administrador
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Verificar si el usuario es administrador
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (perfil && perfil.role === 'admin') {
          setIsAdmin(true);
        }
      } else {
        // Verificar si hay un admin local (para la funcionalidad existente)
        const storedAdminStatus = localStorage.getItem('localAdminStatus');
        if (storedAdminStatus === 'true') {
          setIsAdmin(true);
        }
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(perfil?.role === 'admin' || false);
      } else {
        setIsAdmin(localStorage.getItem('localAdminStatus') === 'true');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      // Limpiar el estado de autenticación local si existe
      localStorage.removeItem('localAdminStatus');
      
      // Cerrar sesión en Supabase
      await supabase.auth.signOut();
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente"
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive"
      });
    }
  };
  
  return <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-rental-500">Cousateca</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-rental-500 font-medium">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-rental-500 font-medium">Productos</Link>
            <Link to="/categories" className="text-gray-700 hover:text-rental-500 font-medium">
              Categorías
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-rental-500 font-medium">Cómo funciona</Link>
          </nav>

          {/* Search, Cart, User (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="Buscar productos..." className="pl-8 pr-4 py-2 w-full" />
            </div>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Carrito">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && <Badge className="absolute -top-2 -right-2 bg-rental-500 text-white">
                    {itemCount}
                  </Badge>}
              </Button>
            </Link>
            
            {/* User Dropdown Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Mi cuenta" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      <span>Mi Cuenta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Mis Reservas</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        <span>Panel de Administrador</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Desconexión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" aria-label="Mi cuenta">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Link to="/cart" className="mr-2">
              <Button variant="ghost" size="icon" className="relative" aria-label="Carrito">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && <Badge className="absolute -top-2 -right-2 bg-rental-500 text-white">
                    {itemCount}
                  </Badge>}
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menú">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="mb-8 mt-6">
                    <span className="text-xl font-bold text-rental-500">Cousateca</span>
                  </div>
                  <div className="relative w-full mb-6">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input type="search" placeholder="Buscar productos..." className="pl-8 pr-4 py-2 w-full" />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    <Link to="/" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                      Inicio
                    </Link>
                    <Link to="/products" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                      Todos los Productos
                    </Link>
                    <Link to="/categories" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                      Categorías
                    </Link>
                    <Link to="/how-it-works" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                      Cómo Funciona
                    </Link>
                    
                    {user ? (
                      <>
                        <Link to="/profile" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                          Mi Cuenta
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                          Mis Reservas
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                            Panel de Administrador
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout} 
                          className="text-left text-gray-700 hover:text-rental-500 font-medium py-2"
                        >
                          Desconexión
                        </button>
                      </>
                    ) : (
                      <Link to="/auth" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                        Iniciar Sesión
                      </Link>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;
