
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Image, Plus, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

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
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  productForm, 
  setProductForm, 
  isEditingProduct, 
  handleSaveProduct, 
  categories,
  setIsProductDialogOpen,
  isLoading = false
}) => {
  const [imageValidation, setImageValidation] = useState<{[key: number]: 'valid' | 'invalid' | 'loading' | 'unknown'}>({});
  const [showImagePreviews, setShowImagePreviews] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Validar campos requeridos
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!productForm.nombre?.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (!productForm.categoria_id) {
      errors.categoria_id = 'La categoría es obligatoria';
    }
    
    if (!productForm.precio_diario || productForm.precio_diario <= 0) {
      errors.precio_diario = 'El precio diario debe ser mayor que 0';
    }
    
    if (!productForm.descripcion_corta?.trim()) {
      errors.descripcion_corta = 'La descripción corta es obligatoria';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validar URL de imagen
  const validateImageUrl = async (url: string, index: number) => {
    if (!url.trim()) {
      setImageValidation(prev => ({ ...prev, [index]: 'unknown' }));
      return;
    }

    setImageValidation(prev => ({ ...prev, [index]: 'loading' }));
    
    try {
      // Validar formato de URL
      const urlObj = new URL(url);
      const isValidImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname);
      
      if (!isValidImageExtension) {
        setImageValidation(prev => ({ ...prev, [index]: 'invalid' }));
        return;
      }

      // Intentar cargar la imagen
      const img = new Image();
      img.onload = () => {
        setImageValidation(prev => ({ ...prev, [index]: 'valid' }));
      };
      img.onerror = () => {
        setImageValidation(prev => ({ ...prev, [index]: 'invalid' }));
      };
      img.src = url;
      
    } catch {
      setImageValidation(prev => ({ ...prev, [index]: 'invalid' }));
    }
  };

  // Debounce para validación de imágenes
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    productForm.imagenes?.forEach((url, index) => {
      const timeout = setTimeout(() => {
        validateImageUrl(url, index);
      }, 1000);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [productForm.imagenes]);

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
    
    // Limpiar validación de la imagen eliminada
    setImageValidation(prev => {
      const newValidation = { ...prev };
      delete newValidation[index];
      return newValidation;
    });
  };

  const getImageValidationIcon = (index: number) => {
    const status = imageValidation[index];
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    await handleSaveProduct();
  };

  const validImageUrls = productForm.imagenes?.filter(url => 
    url.trim() !== '' && imageValidation[productForm.imagenes.indexOf(url)] === 'valid'
  ) || [];

  return (
    <div className="grid gap-4 py-4">
      {/* Campos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={productForm.nombre || ''}
            onChange={(e) => {
              setProductForm({...productForm, nombre: e.target.value});
              if (formErrors.nombre) {
                setFormErrors(prev => ({ ...prev, nombre: '' }));
              }
            }}
            placeholder="Nombre del producto"
            className={formErrors.nombre ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {formErrors.nombre && (
            <p className="text-sm text-red-500">{formErrors.nombre}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría *</Label>
          <Select
            value={productForm.categoria_id || ''}
            onValueChange={(value) => {
              setProductForm({...productForm, categoria_id: value});
              if (formErrors.categoria_id) {
                setFormErrors(prev => ({ ...prev, categoria_id: '' }));
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className={formErrors.categoria_id ? 'border-red-500' : ''}>
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
          {formErrors.categoria_id && (
            <p className="text-sm text-red-500">{formErrors.categoria_id}</p>
          )}
        </div>
      </div>

      {/* Descripción corta */}
      <div className="space-y-2">
        <Label htmlFor="descripcion_corta">Descripción Corta *</Label>
        <Input
          id="descripcion_corta"
          value={productForm.descripcion_corta || ''}
          onChange={(e) => {
            setProductForm({...productForm, descripcion_corta: e.target.value});
            if (formErrors.descripcion_corta) {
              setFormErrors(prev => ({ ...prev, descripcion_corta: '' }));
            }
          }}
          placeholder="Breve descripción para tarjetas de producto"
          className={formErrors.descripcion_corta ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {formErrors.descripcion_corta && (
          <p className="text-sm text-red-500">{formErrors.descripcion_corta}</p>
        )}
        <p className="text-xs text-gray-500">
          Aparece en las tarjetas de producto. Máximo recomendado: 100 caracteres.
        </p>
      </div>

      {/* Descripción completa */}
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción Completa</Label>
        <Textarea
          id="descripcion"
          value={productForm.descripcion || ''}
          onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
          placeholder="Descripción detallada del producto"
          rows={4}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Descripción detallada que aparece en la página del producto.
        </p>
      </div>

      {/* Precios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="precio_diario">Precio Diario (€) *</Label>
          <Input
            id="precio_diario"
            type="number"
            min="0"
            step="0.01"
            value={productForm.precio_diario || ''}
            onChange={(e) => {
              setProductForm({...productForm, precio_diario: parseFloat(e.target.value) || 0});
              if (formErrors.precio_diario) {
                setFormErrors(prev => ({ ...prev, precio_diario: '' }));
              }
            }}
            placeholder="0.00"
            className={formErrors.precio_diario ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {formErrors.precio_diario && (
            <p className="text-sm text-red-500">{formErrors.precio_diario}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deposito">Depósito (€)</Label>
          <Input
            id="deposito"
            type="number"
            min="0"
            step="0.01"
            value={productForm.deposito || ''}
            onChange={(e) => setProductForm({...productForm, deposito: parseFloat(e.target.value) || 0})}
            placeholder="0.00"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            Cantidad retenida como garantía durante el alquiler.
          </p>
        </div>
      </div>

      {/* Gestión de imágenes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Imágenes del Producto *</Label>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowImagePreviews(!showImagePreviews)}
              disabled={isLoading}
            >
              {showImagePreviews ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showImagePreviews ? 'Ocultar' : 'Ver'} Previsualizaciones
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddImage}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1" /> Añadir Imagen
            </Button>
          </div>
        </div>

        {productForm.imagenes && productForm.imagenes.map((url, index) => (
          <div key={index} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="pl-9 pr-10"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-3">
                  {getImageValidationIcon(index)}
                </div>
              </div>
              {(productForm.imagenes?.length || 0) > 1 && (
                <Button 
                  type="button" 
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                  className="flex-shrink-0"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            
            {/* Previsualización de imagen */}
            {showImagePreviews && url && imageValidation[index] === 'valid' && (
              <div className="mt-2">
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                  onError={() => setImageValidation(prev => ({ ...prev, [index]: 'invalid' }))}
                />
              </div>
            )}
            
            {/* Mensaje de error para imagen inválida */}
            {imageValidation[index] === 'invalid' && url.trim() !== '' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  URL de imagen inválida. Verifica que la URL sea correcta y termine en .jpg, .png, .gif, .webp o .svg
                </AlertDescription>
              </Alert>
            )}
          </div>
        ))}

        {/* Resumen de imágenes válidas */}
        {validImageUrls.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ {validImageUrls.length} imagen(es) válida(s) encontrada(s)
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Configuraciones adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="disponible"
            checked={productForm.disponible}
            onCheckedChange={(checked) => setProductForm({...productForm, disponible: checked})}
            disabled={isLoading}
          />
          <Label htmlFor="disponible">Disponible para alquilar</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="destacado"
            checked={productForm.destacado}
            onCheckedChange={(checked) => setProductForm({...productForm, destacado: checked})}
            disabled={isLoading}
          />
          <Label htmlFor="destacado">Producto destacado</Label>
        </div>
      </div>

      {/* Información adicional */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>💡 Consejos:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Usa imágenes de alta calidad (mínimo 300x300px)</li>
            <li>• La primera imagen será la principal en las tarjetas</li>
            <li>• Los productos destacados aparecen en la página de inicio</li>
            <li>• El depósito es opcional pero recomendado para productos de alto valor</li>
          </ul>
        </AlertDescription>
      </Alert>

      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => setIsProductDialogOpen(false)}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          className="bg-rental-500 hover:bg-rental-600" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditingProduct ? 'Guardando...' : 'Creando...'}
            </>
          ) : (
            <>
              {isEditingProduct ? '💾 Guardar Cambios' : '➕ Crear Producto'}
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ProductForm;
