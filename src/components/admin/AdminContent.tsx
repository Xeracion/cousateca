
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsPanel from './ProductsPanel';
import CategoriesPanel from './CategoriesPanel';
import ReservationsPanel from './ReservationsPanel';
import AdminDebugPanel from './AdminDebugPanel';

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
  const [activeTab, setActiveTab] = useState("products");

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona productos, categorías y reservas de tu plataforma</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Productos ({products.length})</TabsTrigger>
          <TabsTrigger value="categories">Categorías ({dbCategories.length})</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsPanel 
            products={products}
            categories={dbCategories}
            onProductsChange={loadData}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesPanel 
            categories={dbCategories}
            onCategoriesChange={loadData}
          />
        </TabsContent>

        <TabsContent value="reservations">
          <ReservationsPanel />
        </TabsContent>
      </Tabs>

      {/* Panel de diagnóstico siempre visible */}
      <AdminDebugPanel />
    </div>
  );
};

export default AdminContent;
