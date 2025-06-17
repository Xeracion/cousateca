
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Verificar estado local primero
        const localAdminStatus = localStorage.getItem('localAdminStatus');
        if (localAdminStatus === 'true') {
          setIsLoggedIn(true);
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Verificar usuario de Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsLoggedIn(true);
          
          // Verificar rol de administrador
          const { data: perfil } = await supabase
            .from('perfiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setIsAdmin(perfil?.role === 'admin' || false);
        }
      } catch (error) {
        console.error("Error verificando usuario:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Listener para cambios de estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoggedIn(true);
        
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(perfil?.role === 'admin' || false);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('localAdminStatus');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { isLoggedIn, isAdmin, loading };
};
