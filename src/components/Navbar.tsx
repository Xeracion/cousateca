import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
const Navbar = () => {
  const {
    itemCount
  } = useCart();
  const isMobile = useIsMobile();
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
            <Link to="/auth">
              <Button variant="ghost" size="icon" aria-label="Mi cuenta">
                <User className="h-5 w-5" />
              </Button>
            </Link>
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
                    <Link to="/auth" className="text-gray-700 hover:text-rental-500 font-medium py-2">
                      Mi Cuenta
                    </Link>
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