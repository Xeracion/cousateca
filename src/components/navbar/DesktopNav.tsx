
import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";
import { UserDropdownMenu } from "./UserDropdownMenu";

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
        <Link to="/products" className="text-gray-700 hover:text-rental-500 font-medium">
          Productos
        </Link>
        <Link to="/categories" className="text-gray-700 hover:text-rental-500 font-medium">
          Categorías
        </Link>
        <Link to="/how-it-works" className="text-gray-700 hover:text-rental-500 font-medium">
          Cómo funciona
        </Link>
      </nav>

      {/* Search, Cart, User (Desktop) */}
      <div className="hidden md:flex items-center space-x-4">
        <SearchBar />
        <CartButton itemCount={itemCount} />
        
        {/* User Dropdown Menu */}
        {user ? (
          <UserDropdownMenu user={user} isAdmin={isAdmin} />
        ) : (
          <Link to="/auth">
            <Button variant="ghost" size="icon" aria-label="Mi cuenta">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};
