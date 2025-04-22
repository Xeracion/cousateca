
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
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
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Categoría eliminada",
          description: "La categoría ha sido eliminada correctamente"
        });
        
        onCategoriesChange();
      } catch (error: any) {
        toast({
          title: "Error al eliminar la categoría",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  // Manejar guardar categoría
  const handleSaveCategory = async () => {
    try {
      if (!categoryForm.nombre_es) {
        throw new Error("El nombre de la categoría es obligatorio");
      }
      
      if (isEditingCategory && selectedCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            nombre: categoryForm.nombre_es, // Keep both fields in sync
            nombre_es: categoryForm.nombre_es,
            descripcion: categoryForm.descripcion_es, // Keep both fields in sync
            descripcion_es: categoryForm.descripcion_es,
            imagen_url: categoryForm.imagen_url
          })
          .eq('id', selectedCategory.id);
        
        if (error) throw error;
        
        toast({
          title: "Categoría actualizada",
          description: "La categoría ha sido actualizada correctamente"
        });
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert({
            nombre: categoryForm.nombre_es, // Keep both fields in sync
            nombre_es: categoryForm.nombre_es,
            descripcion: categoryForm.descripcion_es, // Keep both fields in sync
            descripcion_es: categoryForm.descripcion_es,
            imagen_url: categoryForm.imagen_url
          });
        
        if (error) throw error;
        
        toast({
          title: "Categoría creada",
          description: "La categoría ha sido creada correctamente"
        });
      }
      
      setIsCategoryDialogOpen(false);
      onCategoriesChange();
    } catch (error: any) {
      toast({
        title: "Error al guardar la categoría",
        description: error.message,
        variant: "destructive"
      });
    }
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
