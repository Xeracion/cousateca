
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCategoriesManagement } from "@/hooks/useCategoriesManagement";
import CategoryTable from './CategoryTable';
import CategoryDialog from './CategoryDialog';

interface CategoriesPanelProps {
  categories: any[];
  onCategoriesChange: () => void;
}

const CategoriesPanel: React.FC<CategoriesPanelProps> = ({ 
  categories: initialCategories,
  onCategoriesChange 
}) => {
  const {
    categories,
    isLoading,
    isEditingCategory,
    isCategoryDialogOpen,
    categoryForm,
    setCategoryForm,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    openNewCategoryDialog,
    setIsCategoryDialogOpen
  } = useCategoriesManagement();

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button 
          className="bg-rental-500 hover:bg-rental-600"
          onClick={openNewCategoryDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Categorías</CardTitle>
          <CardDescription>
            Administra las categorías de productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryTable 
            categories={categories} 
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </CardContent>
      </Card>
      
      <CategoryDialog
        isOpen={isCategoryDialogOpen}
        setIsOpen={setIsCategoryDialogOpen}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        isEditing={isEditingCategory}
        onSave={handleSaveCategory}
      />
    </>
  );
};

export default CategoriesPanel;
