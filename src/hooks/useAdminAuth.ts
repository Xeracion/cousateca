
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: perfil } = await supabase
            .from('perfiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (perfil && perfil.role === 'admin') {
            setIsAdmin(true);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(true);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Error verificando usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (perfil && perfil.role === 'admin') {
          setIsAdmin(true);
        }
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { isLoggedIn, isAdmin, loading };
};
