
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsPanel from './ProductsPanel';
import CategoriesPanel from './CategoriesPanel';
import ReservationsPanel from './ReservationsPanel';
import { supabase } from "@/integrations/supabase/client";

interface AdminContentProps {
  loadData: () => Promise<void>;
  products: any[];
  dbCategories: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  setDbCategories: React.Dispatch<React.SetStateAction<any[]>>;
}

const AdminContent: React.FC<AdminContentProps> = ({ 
  loadData, 
  products, 
  dbCategories, 
  setProducts, 
  setDbCategories 
}) => {
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      
      <Tabs defaultValue="productos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="productos">
          <ProductsPanel 
            products={products}
            categories={dbCategories}
            onProductsChange={() => loadData()}
          />
        </TabsContent>
        
        <TabsContent value="categorias">
          <CategoriesPanel 
            categories={dbCategories}
            onCategoriesChange={() => loadData()}
          />
        </TabsContent>
        
        <TabsContent value="reservas">
          <ReservationsPanel />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AdminContent;
