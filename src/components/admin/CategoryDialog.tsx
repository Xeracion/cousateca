
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm as ICategoryForm } from "@/hooks/useCategoriesManagement";
import CategoryForm from './CategoryForm';

interface CategoryDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryForm: ICategoryForm;
  setCategoryForm: React.Dispatch<React.SetStateAction<ICategoryForm>>;
  isEditing: boolean;
  onSave: () => Promise<void>;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  setIsOpen,
  categoryForm,
  setCategoryForm,
  isEditing,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            Completa los detalles de la categoría.
          </DialogDescription>
        </DialogHeader>
        
        <CategoryForm 
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          isEditingCategory={isEditing}
          handleSaveCategory={onSave}
          setIsCategoryDialogOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
