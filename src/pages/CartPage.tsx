
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/context/CartContext";
import { Calendar, ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const CartPage = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  
  // Calculate total deposit amount
  const totalDeposit = items.reduce((sum, item) => sum + item.product.deposit, 0);
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Looks like you haven't added any rental items to your cart yet.
                  Start browsing our products to find what you need.
                </p>
                <Button 
                  className="bg-rental-500 hover:bg-rental-600"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
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
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Rental Period</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.product.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                                  <img 
                                    src={item.product.images[0]} 
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
                                  <p className="text-sm text-gray-500">
                                    {item.product.category}
                                  </p>
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
                                {item.rentalDays} days
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatCurrency(item.product.dailyPrice * item.rentalDays)}
                              </div>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(item.product.dailyPrice)} / day
                              </p>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeFromCart(item.product.id)}
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
                          <div className="w-20 h-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
                            <img 
                              src={item.product.images[0]} 
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
                            <p className="text-sm text-gray-500">Rental Period</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 text-rental-500 mr-2" />
                              <div className="text-sm">
                                {formatDate(item.startDate)} -<br />
                                {formatDate(item.endDate)}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.rentalDays} days
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <div className="font-medium mt-1">
                              {formatCurrency(item.product.dailyPrice * item.rentalDays)}
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(item.product.dailyPrice)} / day
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      className="text-gray-600"
                      onClick={() => clearCart()}
                    >
                      Clear Cart
                    </Button>
                    <Button 
                      className="bg-rental-500 hover:bg-rental-600"
                      onClick={() => navigate("/products")}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit</span>
                      <span>{formatCurrency(totalDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>{formatCurrency(10)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice + totalDeposit + 10)}</span>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700">
                      Security deposits are fully refundable when items are returned in their original condition.
                    </p>
                  </div>
                  
                  <Button className="w-full bg-rental-500 hover:bg-rental-600 mb-3">
                    Proceed to Checkout
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to our 
                    <Link to="/terms" className="text-rental-500 hover:underline mx-1">
                      Terms of Service
                    </Link>
                    and
                    <Link to="/privacy" className="text-rental-500 hover:underline mx-1">
                      Privacy Policy
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
