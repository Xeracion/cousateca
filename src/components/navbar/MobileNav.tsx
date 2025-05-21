
import React from "react";
import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartButton } from "./CartButton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MobileNavProps {
  itemCount: number;
  user: any;
  isAdmin: boolean;
  handleLogout: () => Promise<void>;
}

export const MobileNav = ({ itemCount, user, isAdmin, handleLogout }: MobileNavProps) => {
  return (
    <div className="flex md:hidden">
      <CartButton itemCount={itemCount} />
      <Sheet>
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
  );
};
