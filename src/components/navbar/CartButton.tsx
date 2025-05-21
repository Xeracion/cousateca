
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartButtonProps {
  itemCount: number;
}

export const CartButton = ({ itemCount }: CartButtonProps) => {
  return (
    <Link to="/cart">
      <Button variant="ghost" size="icon" className="relative" aria-label="Carrito">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-rental-500 text-white">
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
};
