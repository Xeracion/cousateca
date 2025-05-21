
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAuthStatus = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Verificar si el usuario es administrador
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (perfil && perfil.role === 'admin') {
          setIsAdmin(true);
        }
      } else {
        // Verificar si hay un admin local (para la funcionalidad existente)
        const storedAdminStatus = localStorage.getItem('localAdminStatus');
        if (storedAdminStatus === 'true') {
          setIsAdmin(true);
        }
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
        setIsAdmin(localStorage.getItem('localAdminStatus') === 'true');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin };
};
