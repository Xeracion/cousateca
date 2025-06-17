
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Search, Edit, Trash2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [operationStatus, setOperationStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
          console.log("🔄 [ADMIN] Cambio detectado:", payload.eventType, payload.new || payload.old);
          
          // Show success notification for operations
          if (payload.eventType === 'INSERT') {
            toast({
              title: "✅ Producto creado",
              description: `${payload.new?.nombre || 'Nuevo producto'} ha sido añadido al catálogo`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "✅ Producto actualizado",
              description: `${payload.new?.nombre || 'Producto'} ha sido modificado`,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "🗑️ Producto eliminado",
              description: "El producto ha sido eliminado del catálogo",
            });
          }
          
          onProductsChange();
        }
      )
      .subscribe((status) => {
        console.log("📡 [ADMIN] Estado realtime:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onProductsChange, toast]);

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

  // Función para verificar permisos de administrador
  const checkAdminPermissions = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (error) {
        console.error("❌ Error verificando permisos:", error);
        return false;
      }
      
      return data?.role === 'admin';
    } catch (error) {
      console.error("❌ Error en verificación de admin:", error);
      return false;
    }
  };

  const handleEditProduct = (product: Product) => {
    console.log("✏️ Editando producto:", product.nombre);
    setSelectedProduct(product);
    setIsEditingProduct(true);
    setIsProductDialogOpen(true);
    setOperationStatus('idle');
  };

  const handleDeleteProduct = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      return;
    }

    console.log("🗑️ Eliminando producto:", nombre);
    setIsLoading(true);
    setOperationStatus('idle');
    
    try {
      // Verificar permisos
      const isAdmin = await checkAdminPermissions();
      if (!isAdmin) {
        throw new Error("No tienes permisos de administrador");
      }

      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("❌ Error al eliminar:", error);
        throw error;
      }
      
      console.log("✅ Producto eliminado exitosamente");
      setOperationStatus('success');
      
      // No need to call onProductsChange here as realtime will handle it
      
    } catch (error: any) {
      console.error("💥 Error completo al eliminar:", error);
      setOperationStatus('error');
      toast({
        title: "❌ Error al eliminar el producto",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductFormSuccess = () => {
    setIsProductDialogOpen(false);
    setSelectedProduct(null);
    setIsEditingProduct(false);
    setOperationStatus('success');
  };

  const handleProductFormCancel = () => {
    setIsProductDialogOpen(false);
    setSelectedProduct(null);
    setIsEditingProduct(false);
  };

  const handleRefresh = () => {
    console.log("🔄 Refrescando datos manualmente");
    onProductsChange();
    toast({
      title: "🔄 Actualizando",
      description: "Refrescando el catálogo de productos..."
    });
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            className="bg-rental-500 hover:bg-rental-600"
            onClick={() => {
              setIsEditingProduct(false);
              setSelectedProduct(null);
              setIsProductDialogOpen(true);
              setOperationStatus('idle');
            }}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {operationStatus === 'success' && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Operación completada exitosamente. Los cambios se reflejarán automáticamente.
          </AlertDescription>
        </Alert>
      )}

      {operationStatus === 'error' && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Hubo un error en la operación. Revisa los logs de la consola para más detalles.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Productos ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Administra todos los productos disponibles para alquiler. Los cambios se sincronizan en tiempo real.
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
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {product.nombre}
                          {product.destacado && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              ⭐ Destacado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {categories.find(c => c.id === product.categoria_id)?.nombre || 
                         <span className="text-red-500">Sin categoría</span>}
                      </TableCell>
                      <TableCell className="text-right">€{product.precio_diario}</TableCell>
                      <TableCell>
                        <Badge variant={product.disponible ? "outline" : "secondary"}>
                          {product.disponible ? "✅ Disponible" : "❌ No disponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteProduct(product.id, product.nombre)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchQuery ? (
                        <>
                          <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500">No se encontraron productos que coincidan con "{searchQuery}"</p>
                        </>
                      ) : (
                        <>
                          <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500">No hay productos en el catálogo</p>
                          <p className="text-sm text-gray-400">Haz clic en "Nuevo Producto" para comenzar</p>
                        </>
                      )}
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
              {isEditingProduct ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              Completa los detalles del producto. Los campos con * son obligatorios.
              {isEditingProduct && selectedProduct && (
                <span className="block mt-1 text-sm text-blue-600">
                  Editando: {selectedProduct.nombre}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm 
            product={selectedProduct}
            categories={categories}
            onSuccess={handleProductFormSuccess}
            onCancel={handleProductFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsPanel;
