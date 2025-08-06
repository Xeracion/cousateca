
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Product } from '@/data/products';
import { useToast } from "@/components/ui/use-toast";

// Definimos la interfaz para los datos que vienen de Supabase
interface SupabaseProduct {
  id: string;
  nombre: string;
  descripcion?: string;
  descripcion_corta?: string;
  precio_diario: number;
  deposito: number;
  imagenes: string[];
  disponible?: boolean;
  destacado?: boolean;
  valoracion?: number;
  num_valoraciones?: number;
  created_at?: string;
  updated_at?: string;
  categoria_id?: string;
  categoria?: {
    id: string;
    nombre: string;
  };
}

// Función auxiliar para convertir productos de Supabase al formato Product
const mapSupabaseProductToProduct = (product: SupabaseProduct): Product => {
  return {
    id: product.id,
    name: product.nombre,
    category: product.categoria?.nombre || "",
    description: product.descripcion || "",
    shortDescription: product.descripcion_corta || "",
    dailyPrice: product.precio_diario,
    deposit: product.deposito,
    images: product.imagenes || [],
    availability: product.disponible !== false, // true por defecto si es undefined
    featured: product.destacado === true,
    rating: product.valoracion || 0,
    reviewCount: product.num_valoraciones || 0,
  };
};

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

export const useProductsRealtime = (initialProducts: Product[] = [], filterOptions?: { featured?: boolean, categoryId?: string }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchData = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      setError(null);
      
      console.log("🔄 Iniciando carga de productos...", filterOptions);
      
      let query = supabase
        .from('productos')
        .select(`
          *,
          categoria:categoria_id (
            id,
            nombre
          )
        `);
      
      // Aplicar filtros si existen
      if (filterOptions?.featured) {
        query = query.eq('destacado', true);
        console.log("✨ Aplicando filtro de productos destacados");
      }
      
      if (filterOptions?.categoryId) {
        query = query.eq('categoria_id', filterOptions.categoryId);
        console.log("📂 Aplicando filtro de categoría:", filterOptions.categoryId);
      }
      
      // Siempre mostrar solo productos disponibles en la web pública
      if (!window.location.pathname.includes('/admin')) {
        query = query.eq('disponible', true);
        console.log("👀 Aplicando filtro de productos disponibles (vista pública)");
      } else {
        console.log("⚙️ Vista de administrador - mostrando todos los productos");
      }
      
      const { data: productsData, error: productsError } = await query;
      
      if (productsError) {
        console.error("❌ Error en consulta de productos:", productsError);
        throw productsError;
      }
      
      console.log("✅ Datos recibidos de Supabase:", productsData?.length, "productos");
      
      // Verificar que tengamos datos válidos
      if (!productsData) {
        console.warn("⚠️ No se recibieron datos de productos");
        setProducts([]);
        return;
      }
      
      // Validar y limpiar imágenes
      const cleanedData = productsData.map(product => {
        const filteredImages = product.imagenes?.filter(isValidImageUrl);
        return {
          ...product,
          imagenes: filteredImages && filteredImages.length > 0 ? filteredImages : ['https://via.placeholder.com/300x300?text=Sin+imagen']
        };
      });
      
      // Convertimos los datos de Supabase al formato Product
      const mappedProducts = cleanedData.map(mapSupabaseProductToProduct);
      setProducts(mappedProducts);
      console.log("🎯 Productos procesados correctamente:", mappedProducts.length);
      
      // Reset retry count on success
      setRetryCount(0);
      
    } catch (error: any) {
      console.error("💥 Error detallado al cargar productos:", error);
      setError(error.message || "Error desconocido");
      
      // Implement retry logic
      if (retryCount < maxRetries) {
        console.log(`🔄 Reintentando... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchData(false), 2000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      toast({
        title: "Error al cargar productos",
        description: error.message || "No se pudieron cargar los productos. Verifica tu conexión.",
        variant: "destructive"
      });
      
      // En caso de error, mantener productos existentes si los hay
      if (products.length === 0) {
        setProducts([]);
      }
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();

    // Suscripción realtime para TODOS los eventos de la tabla productos
    const channel = supabase
      .channel('realtime:productos')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar inserts, updates y deletes
          schema: 'public',
          table: 'productos'
        },
        (payload) => {
          console.log("🔄 Cambio detectado en productos:", payload.eventType, payload.new || payload.old);
          
          // Para cambios en tiempo real, refrescar sin mostrar loading
          setTimeout(() => {
            fetchData(false);
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log("📡 Estado de suscripción realtime:", status);
        
        if (status === 'SUBSCRIBED') {
          console.log("✅ Suscripción realtime activa para productos");
        } else if (status === 'CHANNEL_ERROR') {
          console.error("❌ Error en canal realtime");
          toast({
            title: "Conexión perdida",
            description: "Se perdió la conexión en tiempo real. Los datos podrían no estar actualizados.",
            variant: "destructive"
          });
        }
      });

    return () => {
      console.log("🧹 Limpiando suscripción realtime");
      supabase.removeChannel(channel);
    };
  }, [filterOptions?.featured, filterOptions?.categoryId]);

  return { 
    products, 
    loading, 
    error,
    setProducts, 
    refreshProducts: () => fetchData(true),
    isRetrying: retryCount > 0
  };
};
