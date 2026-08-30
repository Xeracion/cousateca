
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartButton } from "./CartButton";
import { HeaderSearch } from "./HeaderSearch";

interface MobileNavProps {
  itemCount: number;
  user: any;
  isAdmin: boolean;
  handleLogout: () => Promise<void>;
}

export const MobileNav = ({ itemCount, user, isAdmin, handleLogout }: MobileNavProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex md:hidden">
      <CartButton itemCount={itemCount} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Menú" className="ml-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col h-full">
            <div className="mb-8 mt-6">
              <span className="text-xl font-bold text-rental-500">Cousateca</span>
            </div>
            <HeaderSearch className="mb-6" onSearch={() => setOpen(false)} />
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                Inicio
              </Link>
              <Link to="/productos" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                Todos los Productos
              </Link>
              <Link to="/categorias" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                Categorías
              </Link>
              <Link to="/preguntas-frecuentes" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                Cómo Funciona
              </Link>
              
              {user ? (
                <>
                  <Link to="/perfil" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                    Mi Cuenta
                  </Link>
                  <Link to="/perfil" className="text-gray-700 hover:text-rental-500 font-medium py-2">
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
                <Link to="/acceso" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                  Iniciar Sesión
                </Link>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
