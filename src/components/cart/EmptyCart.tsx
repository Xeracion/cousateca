
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-8 flex flex-col items-center justify-center">
        <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Parece que aún no has añadido ningún artículo de alquiler a tu carrito.
          Empieza a explorar nuestros productos para encontrar lo que necesitas.
        </p>
        <Button 
          className="bg-rental-500 hover:bg-rental-600"
          onClick={() => navigate("/products")}
        >
          Explorar Productos
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCart;
