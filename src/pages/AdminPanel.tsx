
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
  const [localLogin, setLocalLogin] = useState(false);
  const [localAdmin, setLocalAdmin] = useState(false);

  // Manejar inicio de sesión manual
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'cousateca2024') {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de administración"
      });
      setLocalLogin(true);
      setLocalAdmin(true);
      setError('');
      loadData();
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleForgotPassword = () => {
    alert("Para recuperar tu contraseña, contacta al administrador del sistema.");
  };

  // Cargar datos de productos y categorías
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
        <div className="flex items-center justify-center">
          <p>Cargando...</p>
        </div>
      </AdminLayout>
    );
  }

  // User is either logged in via Supabase or local admin credentials
  const isUserAdmin = isAdmin || localAdmin;
  const isUserLoggedIn = isLoggedIn || localLogin;

  if (isUserLoggedIn && !isUserAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout>
      {isUserAdmin ? (
        <AdminContent 
          loadData={loadData}
          products={products}
          dbCategories={dbCategories}
          setProducts={setProducts}
          setDbCategories={setDbCategories}
        />
      ) : (
        <div className="flex items-center justify-center">
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
