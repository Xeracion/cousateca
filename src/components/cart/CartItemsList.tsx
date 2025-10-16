import React from "react";
import { Link } from "react-router-dom";
import { CartItem } from "@/context/CartContext";
import { Calendar, Trash2 } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CartItemsListProps {
  items: CartItem[];
  removeFromCart: (productId: string) => void;
}

const CartItemsList = ({ items, removeFromCart }: CartItemsListProps) => {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Producto</TableHead>
              <TableHead>Período de Alquiler</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={item.product.images?.[0] || "/placeholder.svg"} 
                        alt={item.product.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <Link 
                        to={`/product/${item.product.id}`}
                        className="font-medium hover:text-rental-500"
                      >
                        {item.product.name}
                      </Link>
                      {item.product.category && (
                        <p className="text-sm text-gray-500">
                          {item.product.category}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-rental-500 mr-2" />
                    <span>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.rentalDays} días
                  </p>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-lg">
                    {formatCurrency((item.product.dailyPrice || 0) * item.rentalDays)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.product.dailyPrice || 0)} × {item.rentalDays} días
                  </p>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label="Eliminar del carrito"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile layout for cart items */}
      <div className="md:hidden space-y-6">
        {items.map((item) => (
          <div key={item.product.id} className="border-b pb-6 last:border-0 last:pb-0">
            <div className="flex mb-4">
              <div className="w-24 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                <img 
                  src={item.product.images?.[0] || "/placeholder.svg"} 
                  alt={item.product.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <Link 
                    to={`/product/${item.product.id}`}
                    className="font-medium hover:text-rental-500"
                  >
                    {item.product.name}
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label="Eliminar del carrito"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {item.product.category}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Período de Alquiler</p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-rental-500 mr-2" />
                  <div className="text-sm">
                    {formatDate(item.startDate)} -<br />
                    {formatDate(item.endDate)}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.rentalDays} días
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Precio Total</p>
                <div className="font-semibold text-lg mt-1">
                  {formatCurrency((item.product.dailyPrice || 0) * item.rentalDays)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.product.dailyPrice || 0)} × {item.rentalDays} días
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartItemsList;
