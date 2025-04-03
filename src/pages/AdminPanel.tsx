
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/admin/LoginForm";
import ProductsPanel from "@/components/admin/ProductsPanel";
import CategoriesPanel from "@/components/admin/CategoriesPanel";
import ReservationsPanel from "@/components/admin/ReservationsPanel";

// Interfaces
interface Product {
  id: string;
  nombre: string;
  categoria_id: string;
  descripcion: string;
  descripcion_corta: string;
  precio_diario: number;
  precio_semanal: number;
  precio_mensual: number;
  deposito: number;
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
}

interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url?: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estados para productos
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  
  // Estados para categorías
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // Estado del formulario de producto
  const [productForm, setProductForm] = useState<Partial<Product>>({
    nombre: '',
    categoria_id: '',
    descripcion: '',
    descripcion_corta: '',
    precio_diario: 0,
    precio_semanal: 0,
    precio_mensual: 0,
    deposito: 0,
    imagenes: [''],
    disponible: true,
    destacado: false
  });
  
  // Estado del formulario de categoría
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    nombre: '',
    descripcion: '',
    imagen_url: ''
  });

  // Verificar si el usuario está autenticado y es administrador
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
            loadData();
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
    
    // Suscribirse a cambios de autenticación
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
        loadData();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Cargar datos de productos y categorías
  const loadData = async () => {
    try {
      // Cargar productos
      const { data: productsData, error: productsError } = await supabase
        .from('productos')
        .select('*')
        .order('nombre');
      
      if (productsError) throw productsError;
      setProducts(productsData || []);
      setFilteredProducts(productsData || []);
      
      // Cargar categorías
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

  // Manejar inicio de sesión manual (sin autorización real)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciales hardcodeadas para este ejemplo
    if (username === 'admin' && password === 'cousateca2024') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setError('');
      loadData();
    } else {
      setError('Credenciales incorrectas');
    }
  };

  // Filtrar productos según la búsqueda
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product => 
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // Manejar guardar producto
  const handleSaveProduct = async () => {
    try {
      if (!productForm.nombre || !productForm.categoria_id || !productForm.precio_diario) {
        throw new Error("Debes completar los campos obligatorios");
      }
      
      // Validar que las imágenes no estén vacías
      if (!productForm.imagenes || productForm.imagenes.length === 0 || !productForm.imagenes[0]) {
        throw new Error("Debes agregar al menos una imagen");
      }
      
      if (isEditingProduct && selectedProduct) {
        // Actualizar producto existente
        const { data, error } = await supabase
          .from('productos')
          .update(productForm)
          .eq('id', selectedProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente"
        });
      } else {
        // Crear nuevo producto - Asegurarse de que todos los campos requeridos existen
        const completeProduct = {
          nombre: productForm.nombre || '',
          categoria_id: productForm.categoria_id || '',
          descripcion: productForm.descripcion || '',
          descripcion_corta: productForm.descripcion_corta || '',
          precio_diario: productForm.precio_diario || 0,
          precio_semanal: productForm.precio_semanal || 0,
          precio_mensual: productForm.precio_mensual || 0,
          deposito: productForm.deposito || 0,
          imagenes: productForm.imagenes || [''],
          disponible: productForm.disponible !== undefined ? productForm.disponible : true,
          destacado: productForm.destacado !== undefined ? productForm.destacado : false
        };
        
        const { data, error } = await supabase
          .from('productos')
          .insert([completeProduct]);
        
        if (error) throw error;
        
        toast({
          title: "Producto creado",
          description: "El producto se ha creado correctamente"
        });
      }
      
      // Reiniciar formulario y recargar datos
      setProductForm({
        nombre: '',
        categoria_id: '',
        descripcion: '',
        descripcion_corta: '',
        precio_diario: 0,
        precio_semanal: 0,
        precio_mensual: 0,
        deposito: 0,
        imagenes: [''],
        disponible: true,
        destacado: false
      });
      setIsEditingProduct(false);
      setSelectedProduct(null);
      setIsProductDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error al guardar producto",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Manejar guardar categoría
  const handleSaveCategory = async () => {
    try {
      if (!categoryForm.nombre) {
        throw new Error("El nombre de la categoría es obligatorio");
      }
      
      if (isEditingCategory && selectedCategory) {
        // Actualizar categoría existente
        const { data, error } = await supabase
          .from('categories')
          .update(categoryForm)
          .eq('id', selectedCategory.id);
        
        if (error) throw error;
        
        toast({
          title: "Categoría actualizada",
          description: "La categoría se ha actualizado correctamente"
        });
      } else {
        // Crear nueva categoría - Asegurarse de que todos los campos requeridos existen
        const completeCategory = {
          nombre: categoryForm.nombre || '',
          descripcion: categoryForm.descripcion || '',
          imagen_url: categoryForm.imagen_url || ''
        };
        
        const { data, error } = await supabase
          .from('categories')
          .insert([completeCategory]);
        
        if (error) throw error;
        
        toast({
          title: "Categoría creada",
          description: "La categoría se ha creado correctamente"
        });
      }
      
      // Reiniciar formulario y recargar datos
      setCategoryForm({
        nombre: '',
        descripcion: '',
        imagen_url: ''
      });
      setIsEditingCategory(false);
      setSelectedCategory(null);
      setIsCategoryDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error al guardar categoría",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Manejar eliminar producto
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const { error } = await supabase
          .from('productos')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Producto eliminado",
          description: "El producto se ha eliminado correctamente"
        });
        
        loadData();
      } catch (error: any) {
        toast({
          title: "Error al eliminar producto",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  // Manejar eliminar categoría
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría? Esto puede afectar a los productos asociados.")) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Categoría eliminada",
          description: "La categoría se ha eliminado correctamente"
        });
        
        loadData();
      } catch (error: any) {
        toast({
          title: "Error al eliminar categoría",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  // Manejar editar producto
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      nombre: product.nombre,
      categoria_id: product.categoria_id,
      descripcion: product.descripcion,
      descripcion_corta: product.descripcion_corta,
      precio_diario: product.precio_diario,
      precio_semanal: product.precio_semanal,
      precio_mensual: product.precio_mensual,
      deposito: product.deposito,
      imagenes: product.imagenes,
      disponible: product.disponible,
      destacado: product.destacado
    });
    setIsEditingProduct(true);
    setIsProductDialogOpen(true);
  };

  // Manejar editar categoría
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({
      nombre: category.nombre,
      descripcion: category.descripcion,
      imagen_url: category.imagen_url
    });
    setIsEditingCategory(true);
    setIsCategoryDialogOpen(true);
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Si está logueado pero no es admin, redirigir
  if (isLoggedIn && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Si está logueado como admin, mostrar panel
  if (isLoggedIn && isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
          
          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="productos">Productos</TabsTrigger>
              <TabsTrigger value="categorias">Categorías</TabsTrigger>
              <TabsTrigger value="reservas">Reservas</TabsTrigger>
            </TabsList>
            
            {/* Panel de Productos */}
            <TabsContent value="productos">
              <ProductsPanel 
                products={products}
                filteredProducts={filteredProducts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categories={dbCategories}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
                productForm={productForm}
                setProductForm={setProductForm}
                isEditingProduct={isEditingProduct}
                setIsEditingProduct={setIsEditingProduct}
                setSelectedProduct={setSelectedProduct}
                isProductDialogOpen={isProductDialogOpen}
                setIsProductDialogOpen={setIsProductDialogOpen}
                handleSaveProduct={handleSaveProduct}
              />
            </TabsContent>
            
            {/* Panel de Categorías */}
            <TabsContent value="categorias">
              <CategoriesPanel 
                categories={dbCategories}
                handleEditCategory={handleEditCategory}
                handleDeleteCategory={handleDeleteCategory}
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                isEditingCategory={isEditingCategory}
                setIsEditingCategory={setIsEditingCategory}
                setSelectedCategory={setSelectedCategory}
                isCategoryDialogOpen={isCategoryDialogOpen}
                setIsCategoryDialogOpen={setIsCategoryDialogOpen}
                handleSaveCategory={handleSaveCategory}
              />
            </TabsContent>
            
            {/* Panel de Reservas */}
            <TabsContent value="reservas">
              <ReservationsPanel />
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    );
  }

  // Formulario de inicio de sesión
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <LoginForm 
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          error={error}
          handleLogin={handleLogin}
        />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
