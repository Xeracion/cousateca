
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAuthStatus = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Verificar admin local primero
        const storedAdminStatus = localStorage.getItem('localAdminStatus');
        if (storedAdminStatus === 'true') {
          setIsAdmin(true);
        }

        // Verificar usuario de Supabase
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          const { data: perfil } = await supabase
            .from('perfiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (perfil?.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error verificando estado de auth:", error);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(perfil?.role === 'admin' || false);
      } else {
        const storedAdminStatus = localStorage.getItem('localAdminStatus');
        setIsAdmin(storedAdminStatus === 'true');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin };
};
