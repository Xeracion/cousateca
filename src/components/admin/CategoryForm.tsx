
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Image } from "lucide-react";

// Interfaces
interface Category {
  id: string;
  nombre: string;
  nombre_es: string;
  descripcion: string;
  descripcion_es: string;
  imagen_url?: string;
}

interface CategoryFormProps {
  categoryForm: Partial<Category>;
  setCategoryForm: React.Dispatch<React.SetStateAction<Partial<Category>>>;
  isEditingCategory: boolean;
  handleSaveCategory: () => Promise<void>;
  setIsCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  categoryForm, 
  setCategoryForm, 
  isEditingCategory, 
  handleSaveCategory,
  setIsCategoryDialogOpen
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="cat_nombre">Nombre de la categoría *</Label>
        <Input
          id="cat_nombre"
          value={categoryForm.nombre_es || ''}
          onChange={(e) => setCategoryForm({
            ...categoryForm, 
            nombre_es: e.target.value,
            nombre: e.target.value  // Mantenemos sincronizados ambos campos
          })}
          placeholder="Nombre de la categoría"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cat_descripcion_es">Descripción</Label>
        <Textarea
          id="cat_descripcion_es"
          value={categoryForm.descripcion_es || ''}
          onChange={(e) => setCategoryForm({
            ...categoryForm, 
            descripcion_es: e.target.value,
            descripcion: e.target.value  // Mantenemos sincronizados ambos campos
          })}
          placeholder="Descripción de la categoría"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cat_imagen">URL de Imagen</Label>
        <div className="relative">
          <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="cat_imagen"
            value={categoryForm.imagen_url || ''}
            onChange={(e) => setCategoryForm({...categoryForm, imagen_url: e.target.value})}
            placeholder="URL de la imagen (opcional)"
            className="pl-9"
          />
        </div>
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => setIsCategoryDialogOpen(false)}
        >
          Cancelar
        </Button>
        <Button 
          className="bg-rental-500 hover:bg-rental-600" 
          onClick={handleSaveCategory}
        >
          {isEditingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default CategoryForm;
