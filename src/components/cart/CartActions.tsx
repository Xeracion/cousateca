
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CartActionsProps {
  clearCart: () => void;
}

const CartActions = ({ clearCart }: CartActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4 sm:gap-0">
      <Button 
        variant="outline" 
        className="text-gray-600"
        onClick={clearCart}
      >
        Vaciar Carrito
      </Button>
      <Button 
        className="bg-rental-500 hover:bg-rental-600"
        onClick={() => navigate("/products")}
      >
        Seguir Comprando
      </Button>
    </div>
  );
};

export default CartActions;
