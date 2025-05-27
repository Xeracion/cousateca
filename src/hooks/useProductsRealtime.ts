
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

export const useProductsRealtime = (initialProducts: Product[] = [], filterOptions?: { featured?: boolean, categoryId?: string }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Iniciando carga de productos...", filterOptions);
      
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
        console.log("Aplicando filtro de productos destacados");
      }
      
      if (filterOptions?.categoryId) {
        query = query.eq('categoria_id', filterOptions.categoryId);
        console.log("Aplicando filtro de categoría:", filterOptions.categoryId);
      }
      
      // Siempre mostrar solo productos disponibles en la web pública
      if (!window.location.pathname.includes('/admin')) {
        query = query.eq('disponible', true);
        console.log("Aplicando filtro de productos disponibles");
      }
      
      const { data: productsData, error: productsError } = await query;
      
      if (productsError) {
        console.error("Error en consulta de productos:", productsError);
        throw productsError;
      }
      
      console.log("Datos recibidos de Supabase:", productsData);
      
      // Verificar que tengamos datos válidos
      if (!productsData) {
        console.warn("No se recibieron datos de productos");
        setProducts([]);
        return;
      }
      
      // Convertimos los datos de Supabase al formato Product
      const mappedProducts = productsData.map(mapSupabaseProductToProduct);
      setProducts(mappedProducts);
      console.log("Productos procesados correctamente:", mappedProducts.length);
      
    } catch (error: any) {
      console.error("Error detallado al cargar productos:", error);
      setError(error.message || "Error desconocido");
      toast({
        title: "Error al cargar productos",
        description: error.message || "No se pudieron cargar los productos. Inténtalo de nuevo.",
        variant: "destructive"
      });
      // En caso de error, mantener productos existentes si los hay
      if (products.length === 0) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
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
          console.log("Cambio detectado en productos:", payload);
          // Recargar productos en cualquier cambio relevante
          fetchData();
        }
      )
      .subscribe((status) => {
        console.log("Estado de suscripción realtime:", status);
      });

    return () => {
      console.log("Limpiando suscripción realtime");
      supabase.removeChannel(channel);
    };
  }, [filterOptions?.featured, filterOptions?.categoryId]);

  return { 
    products, 
    loading, 
    error,
    setProducts, 
    refreshProducts: fetchData 
  };
};
