
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom components
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { useAuthStatus } from "./navbar/useAuthStatus";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { itemCount } = useCart();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStatus();
  
  const handleLogout = async () => {
    try {
      // Sign out from Supabase
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
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-rental-500">Cousateca</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <DesktopNav itemCount={itemCount} user={user} isAdmin={isAdmin} />

          {/* Mobile Navigation */}
          <MobileNav 
            itemCount={itemCount} 
            user={user} 
            isAdmin={isAdmin} 
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
