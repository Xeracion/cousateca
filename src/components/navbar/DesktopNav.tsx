
import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartButton } from "./CartButton";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { HeaderSearch } from "./HeaderSearch";

interface DesktopNavProps {
  itemCount: number;
  user: any;
  isAdmin: boolean;
}

export const DesktopNav = ({ itemCount, user, isAdmin }: DesktopNavProps) => {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-700 hover:text-rental-500 font-medium">
          Inicio
        </Link>
        <Link to="/productos" className="text-gray-700 hover:text-rental-500 font-medium">
          Productos
        </Link>
        <Link to="/categorias" className="text-gray-700 hover:text-rental-500 font-medium">
          Categorías
        </Link>
        <Link to="/preguntas-frecuentes" className="text-gray-700 hover:text-rental-500 font-medium">
          Cómo funciona
        </Link>
      </nav>

      {/* Search (Desktop) */}
      <HeaderSearch className="hidden md:block w-48 lg:w-64" />

      {/* Cart, User (Desktop) */}
      <div className="hidden md:flex items-center space-x-4">
        <CartButton itemCount={itemCount} />
        
        {/* User Dropdown Menu */}
        {user ? (
          <UserDropdownMenu user={user} isAdmin={isAdmin} />
        ) : (
          <Link to="/acceso">
            <Button variant="ghost" size="icon" aria-label="Mi cuenta">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};
