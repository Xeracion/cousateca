
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Category interface
export interface Category {
  id: string;
  nombre: string;
  nombre_es: string;
  descripcion: string;
  descripcion_es: string;
  imagen_url?: string;
}

export interface CategoryForm extends Partial<Category> {}

export const useCategoriesManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    nombre: '',
    nombre_es: '',
    descripcion: '',
    descripcion_es: '',
    imagen_url: ''
  });

  // Load categories
  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error al cargar las categorías",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a category
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

  // Handle deleting a category
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
        
        loadCategories();
      } catch (error: any) {
        toast({
          title: "Error al eliminar la categoría",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  // Handle saving a category
  const handleSaveCategory = async () => {
    try {
      if (!categoryForm.nombre_es) {
        throw new Error("El nombre de la categoría es obligatorio");
      }
      
      // Ensure values are never undefined
      const formData = {
        nombre: categoryForm.nombre_es || '',
        nombre_es: categoryForm.nombre_es || '',
        descripcion: categoryForm.descripcion_es || '',
        descripcion_es: categoryForm.descripcion_es || '',
        imagen_url: categoryForm.imagen_url || ''
      };
      
      if (isEditingCategory && selectedCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(formData)
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
          .insert(formData);
        
        if (error) throw error;
        
        toast({
          title: "Categoría creada",
          description: "La categoría ha sido creada correctamente"
        });
      }
      
      resetFormAndCloseDialog();
      loadCategories();
    } catch (error: any) {
      toast({
        title: "Error al guardar la categoría",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const openNewCategoryDialog = () => {
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
  };

  const resetFormAndCloseDialog = () => {
    setIsCategoryDialogOpen(false);
    setCategoryForm({
      nombre: '',
      nombre_es: '',
      descripcion: '',
      descripcion_es: '',
      imagen_url: ''
    });
  };

  // Set up real-time subscription
  useEffect(() => {
    loadCategories();
    
    const channel = supabase
      .channel('realtime-categories')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'categories' 
        },
        (payload) => {
          console.log('Cambio en categorías detectado:', payload);
          loadCategories();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    categories,
    isLoading,
    selectedCategory,
    isEditingCategory,
    isCategoryDialogOpen,
    categoryForm,
    setCategoryForm,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    openNewCategoryDialog,
    setIsCategoryDialogOpen
  };
};
