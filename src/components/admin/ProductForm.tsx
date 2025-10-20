
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductFormProps {
  product?: any;
  categories: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

// Función para generar URL de placeholder
const getPlaceholderImage = (name: string) => {
  const encodedName = encodeURIComponent(name || 'Producto');
  return `https://via.placeholder.com/300x300?text=${encodedName}`;
};

const ProductForm = ({ product, categories, onSuccess, onCancel }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
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
      setImageUrls(product.imagenes);
      setImagePreviews(product.imagenes);
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar tipo de archivo
    const validFiles = files.filter(file => {
      const isValid = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isValid) {
        toast.error(`El archivo ${file.name} no es JPG o PNG`);
      }
      return isValid;
    });

    if (validFiles.length === 0) return;

    // Crear previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setImageFiles(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revocar la URL del preview para liberar memoria
      if (prev[index] && prev[index].startsWith('blob:')) {
        URL.revokeObjectURL(prev[index]);
      }
      return newPreviews;
    });
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return imageUrls;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('Imagenes')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error(`Error al subir ${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('Imagenes')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      return [...imageUrls.filter(url => !url.startsWith('blob:')), ...uploadedUrls];
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando envío del formulario...');
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre del producto es obligatorio');
      return;
    }

    if (formData.precio_diario <= 0) {
      toast.error('El precio diario debe ser mayor que 0');
      return;
    }

    if (imagePreviews.length === 0) {
      toast.error('Debes subir al menos una imagen del producto');
      return;
    }

    setLoading(true);

    try {
      // Subir imágenes nuevas
      const finalImageUrls = await uploadImages();
      
      if (finalImageUrls.length === 0) {
        toast.error('No se pudo subir ninguna imagen');
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        imagenes: finalImageUrls,
        updated_at: new Date().toISOString()
      };

      console.log('📦 Datos del producto a enviar:', productData);

      let result;
      if (product?.id) {
        console.log('🔄 Actualizando producto existente:', product.id);
        result = await supabase
          .from('productos')
          .update(productData)
          .eq('id', product.id)
          .select();
      } else {
        console.log('➕ Creando nuevo producto');
        result = await supabase
          .from('productos')
          .insert(productData)
          .select();
      }

      console.log('📤 Resultado de la operación:', result);

      if (result.error) {
        console.error('❌ Error en la operación de base de datos:', result.error);
        throw new Error(`Error de base de datos: ${result.error.message}`);
      }

      if (!result.data || result.data.length === 0) {
        console.warn('⚠️ La operación no devolvió datos');
        throw new Error('La operación no devolvió datos válidos');
      }

      console.log('✅ Producto guardado exitosamente:', result.data[0]);
      
      toast.success(
        product?.id 
          ? `Producto "${formData.nombre}" actualizado exitosamente` 
          : `Producto "${formData.nombre}" creado exitosamente`
      );
      
      // Pequeño delay para asegurar que el toast se muestre
      setTimeout(() => {
        onSuccess();
      }, 500);

    } catch (error: any) {
      console.error('💥 Error completo al guardar producto:', error);
      
      let errorMessage = 'Error desconocido';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (error.details) {
        errorMessage = error.details;
      }
      
      toast.error(`Error al ${product?.id ? 'actualizar' : 'crear'} producto: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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
            <div className="flex items-center gap-2">
              <Label 
                htmlFor="image-upload" 
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Subir Imágenes (JPG/PNG)
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Vista previa de imágenes */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Badge 
                      variant="secondary" 
                      className="absolute bottom-2 left-2 text-xs"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {imagePreviews.length === 0 && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay imágenes cargadas</p>
                <p className="text-sm">Sube al menos una imagen JPG o PNG</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || uploadingImages}>
          {loading || uploadingImages ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadingImages ? 'Subiendo imágenes...' : (product?.id ? 'Actualizando...' : 'Creando...')}
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
