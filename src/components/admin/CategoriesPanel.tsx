import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import CategoryForm from './CategoryForm';

// Interfaces
interface Category {
  id: string;
  nombre: string;
  nombre_es: string;
  descripcion: string;
  descripcion_es: string;
  imagen_url?: string;
}

interface CategoriesPanelProps {
  categories: any[];
  onCategoriesChange: () => void;
}

const CategoriesPanel: React.FC<CategoriesPanelProps> = ({ 
  categories,
  onCategoriesChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    nombre: '',
    nombre_es: '',
    descripcion: '',
    descripcion_es: '',
    imagen_url: ''
  });

  // Manejar editar categoría
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({
      nombre: category.nombre,
      nombre_es: category.nombre_es,
      descripcion: category.descripcion,
      descripcion_es: category.descripcion_es,
      imagen_url: category.imagen_url
    });
    setIsEditingCategory(true);
    setIsCategoryDialogOpen(true);
  };

  // Manejar eliminar categoría
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría? Esto puede afectar a los productos asociados.")) {
      // Lógica para eliminar la categoría
      console.log(`Deleting category with id: ${id}`);
      // Después de eliminar, recargar las categorías
      onCategoriesChange();
    }
  };

  // Manejar guardar categoría
  const handleSaveCategory = async () => {
    // Lógica para guardar la categoría
    console.log('Saving category', categoryForm);
    // Después de guardar, recargar las categorías
    onCategoriesChange();
    setIsCategoryDialogOpen(false);
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button 
          className="bg-rental-500 hover:bg-rental-600"
          onClick={() => {
            setCategoryForm({
              nombre: '',
              nombre_es: '',
              descripcion: '',
              descripcion_es: '',
              imagen_url: ''
            });
            setIsEditingCategory(false);
            setSelectedCategory(null);
            setIsCategoryDialogOpen(true);
          }}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category: Category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.nombre_es}</TableCell>
                    <TableCell>{category.descripcion_es || ''}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No hay categorías disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Diálogo para crear/editar categoría */}
      <Dialog 
        open={isCategoryDialogOpen} 
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </DialogTitle>
            <DialogDescription>
              Completa los detalles de la categoría.
            </DialogDescription>
          </DialogHeader>
          
          <CategoryForm 
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            isEditingCategory={isEditingCategory}
            handleSaveCategory={handleSaveCategory}
            setIsCategoryDialogOpen={setIsCategoryDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoriesPanel;
