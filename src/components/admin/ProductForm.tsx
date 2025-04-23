
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { Trash2, Image, Plus } from "lucide-react";

interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url?: string;
}

interface Product {
  id: string;
  nombre: string;
  categoria_id: string;
  descripcion: string;
  descripcion_corta: string;
  precio_diario: number;
  precio_semanal: number;
  precio_mensual: number;
  deposito: number;
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
}

interface ProductFormProps {
  productForm: Partial<Product>;
  setProductForm: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  isEditingProduct: boolean;
  handleSaveProduct: () => Promise<void>;
  categories: Category[];
  setIsProductDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  productForm, 
  setProductForm, 
  isEditingProduct, 
  handleSaveProduct, 
  categories,
  setIsProductDialogOpen
}) => {
  const handleAddImage = () => {
    setProductForm(prev => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), '']
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...(productForm.imagenes || [])];
    newImages[index] = value;
    setProductForm(prev => ({
      ...prev,
      imagenes: newImages
    }));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(productForm.imagenes || [])];
    newImages.splice(index, 1);
    setProductForm(prev => ({
      ...prev,
      imagenes: newImages.length ? newImages : ['']
    }));
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={productForm.nombre || ''}
            onChange={(e) => setProductForm({...productForm, nombre: e.target.value})}
            placeholder="Nombre del producto"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría *</Label>
          <Select
            value={productForm.categoria_id || ''}
            onValueChange={(value) => setProductForm({...productForm, categoria_id: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion_corta">Descripción Corta *</Label>
        <Input
          id="descripcion_corta"
          value={productForm.descripcion_corta || ''}
          onChange={(e) => setProductForm({...productForm, descripcion_corta: e.target.value})}
          placeholder="Breve descripción para tarjetas de producto"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción Completa</Label>
        <Textarea
          id="descripcion"
          value={productForm.descripcion || ''}
          onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
          placeholder="Descripción detallada del producto"
          rows={4}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="precio_diario">Precio Diario (€) *</Label>
          <Input
            id="precio_diario"
            type="number"
            min="0"
            step="0.01"
            value={productForm.precio_diario || ''}
            onChange={(e) => setProductForm({...productForm, precio_diario: parseFloat(e.target.value)})}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="precio_semanal">Precio Semanal (€)</Label>
          <Input
            id="precio_semanal"
            type="number"
            min="0"
            step="0.01"
            value={productForm.precio_semanal || ''}
            onChange={(e) => setProductForm({...productForm, precio_semanal: parseFloat(e.target.value)})}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="precio_mensual">Precio Mensual (€)</Label>
          <Input
            id="precio_mensual"
            type="number"
            min="0"
            step="0.01"
            value={productForm.precio_mensual || ''}
            onChange={(e) => setProductForm({...productForm, precio_mensual: parseFloat(e.target.value)})}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deposito">Depósito (€)</Label>
          <Input
            id="deposito"
            type="number"
            min="0"
            step="0.01"
            value={productForm.deposito || ''}
            onChange={(e) => setProductForm({...productForm, deposito: parseFloat(e.target.value)})}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Imágenes *</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddImage}
          >
            <Plus className="h-4 w-4 mr-1" /> Añadir Imagen
          </Button>
        </div>
        {productForm.imagenes && productForm.imagenes.map((url, index) => (
          <div key={index} className="flex gap-2">
            <div className="relative flex-grow">
              <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="URL de la imagen"
                className="pl-9"
              />
            </div>
            {(productForm.imagenes?.length || 0) > 1 && (
              <Button 
                type="button" 
                variant="outline"
                size="icon"
                onClick={() => handleRemoveImage(index)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="disponible"
            checked={productForm.disponible}
            onCheckedChange={(checked) => setProductForm({...productForm, disponible: checked})}
          />
          <Label htmlFor="disponible">Disponible para alquilar</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="destacado"
            checked={productForm.destacado}
            onCheckedChange={(checked) => setProductForm({...productForm, destacado: checked})}
          />
          <Label htmlFor="destacado">Producto destacado</Label>
        </div>
      </div>
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => setIsProductDialogOpen(false)}
        >
          Cancelar
        </Button>
        <Button 
          className="bg-rental-500 hover:bg-rental-600" 
          onClick={handleSaveProduct}
        >
          {isEditingProduct ? 'Guardar Cambios' : 'Crear Producto'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ProductForm;
