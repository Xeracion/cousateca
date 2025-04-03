
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

// Cart Components
import EmptyCart from "@/components/cart/EmptyCart";
import CartItemsList from "@/components/cart/CartItemsList";
import CartActions from "@/components/cart/CartActions";
import OrderSummary from "@/components/cart/OrderSummary";

const CartPage = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  
  // Show the empty cart state if there are no items
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
            <EmptyCart />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <CartItemsList 
                    items={items} 
                    removeFromCart={removeFromCart} 
                  />
                  
                  <CartActions clearCart={clearCart} />
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <OrderSummary 
                items={items} 
                totalPrice={totalPrice} 
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
