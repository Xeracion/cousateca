
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import ProductForm from './ProductForm';

// Interfaces
interface Product {
  id: string;
  nombre: string;
  categoria_id: string;
  descripcion: string;
  descripcion_corta: string;
  precio_diario: number;
  precio_semanal: number;
  precio_mensual: number;
  deposito: number;
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
}

interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url?: string;
}

interface ProductsPanelProps {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  categories: Category[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (id: string) => Promise<void>;
  productForm: Partial<Product>;
  setProductForm: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  isEditingProduct: boolean;
  setIsEditingProduct: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  isProductDialogOpen: boolean;
  setIsProductDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveProduct: () => Promise<void>;
}

const ProductsPanel: React.FC<ProductsPanelProps> = ({
  products,
  filteredProducts,
  searchQuery,
  setSearchQuery,
  categories,
  handleEditProduct,
  handleDeleteProduct,
  productForm,
  setProductForm,
  isEditingProduct,
  setIsEditingProduct,
  setSelectedProduct,
  isProductDialogOpen,
  setIsProductDialogOpen,
  handleSaveProduct
}) => {
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button 
          className="bg-rental-500 hover:bg-rental-600"
          onClick={() => {
            setProductForm({
              nombre: '',
              categoria_id: '',
              descripcion: '',
              descripcion_corta: '',
              precio_diario: 0,
              precio_semanal: 0,
              precio_mensual: 0,
              deposito: 0,
              imagenes: [''],
              disponible: true,
              destacado: false
            });
            setIsEditingProduct(false);
            setSelectedProduct(null);
            setIsProductDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Productos</CardTitle>
          <CardDescription>
            Administra todos los productos disponibles para alquiler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio Diario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.nombre}</TableCell>
                      <TableCell>
                        {categories.find(c => c.id === product.categoria_id)?.nombre || '-'}
                      </TableCell>
                      <TableCell className="text-right">${product.precio_diario}</TableCell>
                      <TableCell>
                        <Badge variant={product.disponible ? "outline" : "secondary"}>
                          {product.disponible ? "Disponible" : "No disponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Diálogo para crear/editar producto */}
      <Dialog 
        open={isProductDialogOpen} 
        onOpenChange={setIsProductDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              Completa los detalles del producto. Los campos con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm 
            productForm={productForm}
            setProductForm={setProductForm}
            isEditingProduct={isEditingProduct}
            handleSaveProduct={handleSaveProduct}
            categories={categories}
            setIsProductDialogOpen={setIsProductDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsPanel;
