
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get authenticated user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsLoggedIn(true);
          
          // Check admin role from user_roles table (server-validated)
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          setIsAdmin(!!userRole);
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
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
    
    // Auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoggedIn(true);
        
        // Check admin role from user_roles table
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!userRole);
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
