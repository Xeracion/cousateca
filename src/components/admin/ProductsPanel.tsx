
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ProductForm from './ProductForm';

// Interfaces
interface Product {
  id: string;
  nombre: string;
  categoria_id: string;
  descripcion: string;
  descripcion_corta: string;
  precio_diario: number;
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
  categories: Category[];
  onProductsChange: () => void;
}

const ProductsPanel: React.FC<ProductsPanelProps> = ({ 
  products,
  categories,
  onProductsChange
}) => {
  const { toast } = useToast();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    nombre: '',
    categoria_id: '',
    descripcion: '',
    descripcion_corta: '',
    precio_diario: 0,
    deposito: 0,
    imagenes: [''],
    disponible: true,
    destacado: false
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('realtime:productos-admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productos'
        },
        (payload) => {
          console.log("Cambio detectado en admin:", payload);
          onProductsChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onProductsChange]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product => 
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      nombre: product.nombre,
      categoria_id: product.categoria_id,
      descripcion: product.descripcion,
      descripcion_corta: product.descripcion_corta,
      precio_diario: product.precio_diario,
      deposito: product.deposito,
      imagenes: product.imagenes && product.imagenes.length > 0 ? product.imagenes : [''],
      disponible: product.disponible,
      destacado: product.destacado
    });
    setIsEditingProduct(true);
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const { error } = await supabase
          .from('productos')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado correctamente"
        });
        
        onProductsChange();
      } catch (error: any) {
        toast({
          title: "Error al eliminar el producto",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (!productForm.nombre || !productForm.categoria_id || !productForm.precio_diario) {
        throw new Error("Por favor, completa los campos obligatorios");
      }
      
      // Ensure imagenes is a valid array
      const imagenes = Array.isArray(productForm.imagenes) && productForm.imagenes.length > 0
        ? productForm.imagenes.filter(img => img.trim() !== '')
        : [];
      
      if (imagenes.length === 0) {
        imagenes.push('https://via.placeholder.com/300x300?text=Sin+imagen');
      }

      if (isEditingProduct && selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('productos')
          .update({
            nombre: productForm.nombre,
            categoria_id: productForm.categoria_id,
            descripcion: productForm.descripcion || '',
            descripcion_corta: productForm.descripcion_corta || '',
            precio_diario: productForm.precio_diario || 0,
            deposito: productForm.deposito || 0,
            imagenes,
            disponible: productForm.disponible !== undefined ? productForm.disponible : true,
            destacado: productForm.destacado || false
          })
          .eq('id', selectedProduct.id);
        
        if (error) {
          console.error("Error al actualizar:", error);
          throw error;
        }
        
        toast({
          title: "Producto actualizado",
          description: "El producto ha sido actualizado correctamente"
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('productos')
          .insert({
            nombre: productForm.nombre,
            categoria_id: productForm.categoria_id,
            descripcion: productForm.descripcion || '',
            descripcion_corta: productForm.descripcion_corta || '',
            precio_diario: productForm.precio_diario || 0,
            deposito: productForm.deposito || 0,
            imagenes,
            disponible: productForm.disponible !== undefined ? productForm.disponible : true,
            destacado: productForm.destacado || false
          });
        
        if (error) {
          console.error("Error al crear:", error);
          throw error;
        }
        
        toast({
          title: "Producto creado",
          description: "El producto ha sido creado correctamente"
        });
      }
      
      setIsProductDialogOpen(false);
      onProductsChange();
    } catch (error: any) {
      console.error("Error completo:", error);
      toast({
        title: "Error al guardar el producto",
        description: error.message,
        variant: "destructive"
      });
    }
  };

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
                      <TableCell className="text-right">€{product.precio_diario}</TableCell>
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
