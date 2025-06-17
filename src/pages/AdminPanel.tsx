
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from '@/components/admin/AdminLayout';
import AdminContent from '@/components/admin/AdminContent';
import LoginForm from "@/components/admin/LoginForm";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();
  const { isLoggedIn, isAdmin, loading } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' || username === 'info@xeracion.org') {
      if (password === 'cousateca2024') {
        localStorage.setItem('localAdminStatus', 'true');
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración"
        });
        setError('');
        loadData();
        // Forzar actualización del estado
        window.location.reload();
      } else {
        setError('Contraseña incorrecta');
      }
    } else {
      setError('Usuario no reconocido');
    }
  };

  const handleForgotPassword = () => {
    alert("Para recuperar tu contraseña, contacta al administrador del sistema.");
  };

  const loadData = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('productos')
        .select('*')
        .order('nombre');
      
      if (productsError) throw productsError;
      setProducts(productsData || []);
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('nombre');
      
      if (categoriesError) throw categoriesError;
      setDbCategories(categoriesData || []);
    } catch (error: any) {
      console.error("Error cargando datos:", error);
      toast({
        title: "Error al cargar datos",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rental-500 mx-auto mb-4"></div>
            <p>Verificando permisos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Si el usuario está logueado pero no es admin, redirigir al inicio
  if (isLoggedIn && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout>
      {isAdmin ? (
        <AdminContent 
          loadData={loadData}
          products={products}
          dbCategories={dbCategories}
          setProducts={setProducts}
          setDbCategories={setDbCategories}
        />
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoginForm 
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            error={error}
            handleLogin={handleLogin}
            handleForgotPassword={handleForgotPassword}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPanel;
