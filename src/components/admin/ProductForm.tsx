
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductFormProps {
  product?: any;
  categories: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

// Función para validar URLs de imágenes
const isValidImageUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
};

// Función para generar URL de placeholder
const getPlaceholderImage = (name: string) => {
  const encodedName = encodeURIComponent(name || 'Producto');
  return `https://via.placeholder.com/300x300?text=${encodedName}`;
};

const ProductForm = ({ product, categories, onSuccess, onCancel }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [imageLoadStates, setImageLoadStates] = useState<{ [key: string]: 'loading' | 'success' | 'error' }>({});
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    descripcion: product?.descripcion || '',
    descripcion_corta: product?.descripcion_corta || '',
    precio_diario: product?.precio_diario || 0,
    deposito: product?.deposito || 0,
    disponible: product?.disponible !== false,
    destacado: product?.destacado === true,
    valoracion: product?.valoracion || 0,
    num_valoraciones: product?.num_valoraciones || 0,
    categoria_id: product?.categoria_id || ''
  });

  useEffect(() => {
    if (product?.imagenes && Array.isArray(product.imagenes)) {
      const validImages = product.imagenes.filter(isValidImageUrl);
      if (validImages.length > 0) {
        setImageUrls([...validImages, '']);
      } else {
        setImageUrls([getPlaceholderImage(product.nombre)]);
      }
    }
  }, [product]);

  // Validar imagen cuando se actualiza la URL
  const validateImage = (url: string, index: number) => {
    if (!url || url.trim() === '') {
      setImageLoadStates(prev => {
        const newState = { ...prev };
        delete newState[`${index}-${url}`];
        return newState;
      });
      return;
    }

    const key = `${index}-${url}`;
    setImageLoadStates(prev => ({ ...prev, [key]: 'loading' }));

    const img = new Image();
    img.onload = () => {
      setImageLoadStates(prev => ({ ...prev, [key]: 'success' }));
    };
    img.onerror = () => {
      setImageLoadStates(prev => ({ ...prev, [key]: 'error' }));
    };
    img.src = url;
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    
    // Si es la última URL y no está vacía, añadir una nueva
    if (index === newUrls.length - 1 && value.trim() !== '') {
      newUrls.push('');
    }
    
    // Si no es la última URL y está vacía, eliminarla (excepto si es la única)
    if (index < newUrls.length - 1 && value.trim() === '' && newUrls.length > 1) {
      newUrls.splice(index, 1);
    }
    
    setImageUrls(newUrls);
    
    // Validar la imagen
    if (value.trim() !== '') {
      validateImage(value, index);
    }
  };

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre del producto es obligatorio');
      return;
    }

    if (formData.precio_diario <= 0) {
      toast.error('El precio diario debe ser mayor que 0');
      return;
    }

    setLoading(true);

    try {
      // Filtrar URLs vacías y generar placeholder si es necesario
      const validImageUrls = imageUrls
        .filter(url => url.trim() !== '')
        .filter(isValidImageUrl);
      
      const finalImageUrls = validImageUrls.length > 0 
        ? validImageUrls 
        : [getPlaceholderImage(formData.nombre)];

      const productData = {
        ...formData,
        imagenes: finalImageUrls,
        updated_at: new Date().toISOString()
      };

      let result;
      if (product?.id) {
        console.log('🔄 Actualizando producto:', product.id, productData);
        result = await supabase
          .from('productos')
          .update(productData)
          .eq('id', product.id)
          .select();
      } else {
        console.log('➕ Creando nuevo producto:', productData);
        result = await supabase
          .from('productos')
          .insert(productData)
          .select();
      }

      if (result.error) {
        console.error('❌ Error en operación:', result.error);
        throw result.error;
      }

      console.log('✅ Operación exitosa:', result.data);
      toast.success(product?.id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      onSuccess();
    } catch (error: any) {
      console.error('💥 Error al guardar producto:', error);
      toast.error(`Error al ${product?.id ? 'actualizar' : 'crear'} producto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getImageStatus = (url: string, index: number) => {
    if (!url || url.trim() === '') return null;
    
    const key = `${index}-${url}`;
    const state = imageLoadStates[key];
    
    if (state === 'loading') return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (state === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (state === 'error') return <AlertCircle className="h-4 w-4 text-red-500" />;
    
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Cámara DSLR Canon"
                required
              />
            </div>

            <div>
              <Label htmlFor="descripcion_corta">Descripción Corta</Label>
              <Textarea
                id="descripcion_corta"
                value={formData.descripcion_corta}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion_corta: e.target.value }))}
                placeholder="Breve descripción del producto..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción Completa</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción detallada del producto..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Precios y estado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Precios y Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio_diario">Precio Diario (€) *</Label>
                <Input
                  id="precio_diario"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precio_diario}
                  onChange={(e) => setFormData(prev => ({ ...prev, precio_diario: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="deposito">Fianza (€)</Label>
                <Input
                  id="deposito"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deposito}
                  onChange={(e) => setFormData(prev => ({ ...prev, deposito: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valoracion">Valoración (0-5)</Label>
                <Input
                  id="valoracion"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.valoracion}
                  onChange={(e) => setFormData(prev => ({ ...prev, valoracion: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div>
                <Label htmlFor="num_valoraciones">Número de Valoraciones</Label>
                <Input
                  id="num_valoraciones"
                  type="number"
                  min="0"
                  value={formData.num_valoraciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, num_valoraciones: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="disponible"
                  checked={formData.disponible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, disponible: checked }))}
                />
                <Label htmlFor="disponible">Producto Disponible</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="destacado"
                  checked={formData.destacado}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, destacado: checked }))}
                />
                <Label htmlFor="destacado">Producto Destacado</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Imágenes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Imágenes del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder="URL de la imagen"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {getImageStatus(url, index)}
                  {url && isValidImageUrl(url) && (
                    <Eye 
                      className="h-4 w-4 text-blue-500 cursor-pointer hover:text-blue-700" 
                      onClick={() => window.open(url, '_blank')}
                    />
                  )}
                  {imageUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImageUrl(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Vista previa de imágenes válidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {imageUrls
                .filter(url => url && isValidImageUrl(url))
                .slice(0, 4)
                .map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage(formData.nombre);
                      }}
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-1 right-1 text-xs"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product?.id ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            product?.id ? 'Actualizar Producto' : 'Crear Producto'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
