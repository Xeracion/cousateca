import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadProgress {
  fileName: string;
  status: UploadStatus;
  url?: string;
  error?: string;
}

export const useImageUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    setUploadStatus('uploading');
    const uploadedImageUrls: string[] = [];
    const progress: UploadProgress[] = files.map(file => ({
      fileName: file.name,
      status: 'uploading' as UploadStatus
    }));
    setUploadProgress(progress);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      try {
        console.log(`Uploading ${file.name} (${i + 1}/${files.length})...`);

        const { error: uploadError, data } = await supabase.storage
          .from('Imagenes')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          
          // Update progress for this file
          setUploadProgress(prev => prev.map((p, idx) => 
            idx === i ? { ...p, status: 'error', error: uploadError.message } : p
          ));

          toast({
            title: "Error al subir imagen",
            description: `${file.name}: ${uploadError.message}`,
            variant: "destructive",
          });

          continue; // Continue with next file
        }

        const { data: { publicUrl } } = supabase.storage
          .from('Imagenes')
          .getPublicUrl(filePath);

        console.log(`Successfully uploaded ${file.name}:`, publicUrl);
        uploadedImageUrls.push(publicUrl);

        // Update progress for this file
        setUploadProgress(prev => prev.map((p, idx) => 
          idx === i ? { ...p, status: 'success', url: publicUrl } : p
        ));

      } catch (error) {
        console.error(`Unexpected error uploading ${file.name}:`, error);
        
        setUploadProgress(prev => prev.map((p, idx) => 
          idx === i ? { ...p, status: 'error', error: 'Error inesperado' } : p
        ));

        toast({
          title: "Error inesperado",
          description: `No se pudo subir ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setUploadedUrls(uploadedImageUrls);
    setUploadStatus(uploadedImageUrls.length > 0 ? 'success' : 'error');

    if (uploadedImageUrls.length > 0) {
      toast({
        title: "Imágenes subidas",
        description: `${uploadedImageUrls.length} de ${files.length} imágenes subidas exitosamente`,
      });
    }

    return uploadedImageUrls;
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress([]);
    setUploadedUrls([]);
  };

  return {
    uploadStatus,
    uploadProgress,
    uploadedUrls,
    uploadImages,
    resetUpload
  };
};
