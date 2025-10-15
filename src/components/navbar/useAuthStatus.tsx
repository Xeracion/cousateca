
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAuthStatus = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Check admin status from user_roles table (server-validated)
        if (user) {
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          setIsAdmin(!!userRole);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error verificando estado de auth:", error);
        setIsAdmin(false);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        // Check admin role from user_roles table
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!userRole);
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin };
};
