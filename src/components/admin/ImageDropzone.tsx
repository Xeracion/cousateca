import React, { useState, useCallback } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
}

const ImageDropzone = ({ 
  onFilesSelected, 
  accept = "image/jpeg,image/png",
  maxFiles = 10 
}: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type === 'image/jpeg' || file.type === 'image/png'
    );

    if (validFiles.length > 0) {
      onFilesSelected(validFiles.slice(0, maxFiles));
    }
  }, [onFilesSelected, maxFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'image/jpeg' || file.type === 'image/png'
    );

    if (validFiles.length > 0) {
      onFilesSelected(validFiles.slice(0, maxFiles));
    }
    
    // Reset input
    e.target.value = '';
  }, [onFilesSelected, maxFiles]);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 transition-all duration-200",
        "hover:border-primary/50 hover:bg-accent/50 cursor-pointer",
        isDragging 
          ? "border-primary bg-primary/10 scale-[1.02]" 
          : "border-border bg-background"
      )}
    >
      <input
        id="image-dropzone-input"
        type="file"
        accept={accept}
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="flex flex-col items-center justify-center gap-3 text-center pointer-events-none">
        <div className={cn(
          "p-4 rounded-full transition-colors",
          isDragging ? "bg-primary/20" : "bg-accent"
        )}>
          {isDragging ? (
            <ImageIcon className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium">
            {isDragging 
              ? "Suelta las imágenes aquí" 
              : "Arrastra y suelta tus imágenes aquí"
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            o haz clic para seleccionar archivos
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-accent rounded">JPG</span>
          <span className="px-2 py-1 bg-accent rounded">PNG</span>
        </div>
      </div>
    </div>
  );
};

export default ImageDropzone;
