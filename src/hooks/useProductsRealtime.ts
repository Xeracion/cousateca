
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
  precio_semanal: number;
  precio_mensual: number;
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
    weeklyPrice: product.precio_semanal,
    monthlyPrice: product.precio_mensual,
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

  const fetchData = async () => {
    try {
      let query = supabase
        .from('productos')
        .select(`
          *,
          categoria:categoria_id (
            id,
            nombre
          )
        `)
        .eq('disponible', true);
      
      // Aplicar filtros si existen
      if (filterOptions?.featured) {
        query = query.eq('destacado', true);
      }
      
      if (filterOptions?.categoryId) {
        query = query.eq('categoria_id', filterOptions.categoryId);
      }
      
      const { data: productsData, error: productsError } = await query;
      
      if (productsError) throw productsError;
      
      // Convertimos los datos de Supabase al formato Product
      const mappedProducts = productsData?.map(mapSupabaseProductToProduct) || [];
      setProducts(mappedProducts);
      console.log("Productos actualizados:", mappedProducts.length);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterOptions?.featured, filterOptions?.categoryId]);

  return { products, loading, setProducts, refreshProducts: fetchData };
};
