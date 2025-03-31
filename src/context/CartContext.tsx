
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  rentalDays: number;
  startDate: Date;
  endDate: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert string dates back to Date objects
        const itemsWithDateObjects = parsedCart.map((item: any) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
        }));
        setItems(itemsWithDateObjects);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    } else {
      localStorage.removeItem("cart");
    }
  }, [items]);

  // Update total price and item count whenever items change
  useEffect(() => {
    const count = items.length;
    const price = items.reduce((total, item) => {
      return total + (item.product.dailyPrice * item.rentalDays);
    }, 0);

    setTotalPrice(price);
    setItemCount(count);
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    // Check if product is already in cart
    const existingItemIndex = items.findIndex(
      (item) => item.product.id === newItem.product.id
    );

    if (existingItemIndex !== -1) {
      // Replace the existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = newItem;
      setItems(updatedItems);
      toast.success("Rental dates updated in cart");
    } else {
      // Add new item
      setItems([...items, newItem]);
      toast.success("Item added to cart");
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter((item) => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    setItems([]);
    toast.info("Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
