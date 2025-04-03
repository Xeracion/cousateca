
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/categories";
import { Trash2, Edit, Image, Plus, Search } from "lucide-react";

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
        // Crear nuevo producto
        const { data, error } = await supabase
          .from('productos')
          .insert([productForm]);
        
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
        // Crear nueva categoría
        const { data, error } = await supabase
          .from('categories')
          .insert([categoryForm]);
        
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

  // Manejar agregar imagen al producto
  const handleAddImage = () => {
    setProductForm(prev => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), '']
    }));
  };

  // Manejar actualizar URL de imagen
  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...(productForm.imagenes || [])];
    newImages[index] = value;
    setProductForm(prev => ({
      ...prev,
      imagenes: newImages
    }));
  };

  // Manejar eliminar imagen
  const handleRemoveImage = (index: number) => {
    const newImages = [...(productForm.imagenes || [])];
    newImages.splice(index, 1);
    setProductForm(prev => ({
      ...prev,
      imagenes: newImages.length ? newImages : ['']
    }));
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
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  className="bg-rental-500 hover:bg-rental-600"
                  onClick={() => {
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
                    setIsProductDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Productos</CardTitle>
                  <CardDescription>
                    Administra todos los productos disponibles para alquiler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Precio Diario</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.nombre}</TableCell>
                              <TableCell>
                                {dbCategories.find(c => c.id === product.categoria_id)?.nombre || '-'}
                              </TableCell>
                              <TableCell className="text-right">${product.precio_diario}</TableCell>
                              <TableCell>
                                <Badge variant={product.disponible ? "outline" : "secondary"}>
                                  {product.disponible ? "Disponible" : "No disponible"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No se encontraron productos
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Diálogo para crear/editar producto */}
              <Dialog 
                open={isProductDialogOpen} 
                onOpenChange={setIsProductDialogOpen}
              >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    </DialogTitle>
                    <DialogDescription>
                      Completa los detalles del producto. Los campos con * son obligatorios.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                          id="nombre"
                          value={productForm.nombre || ''}
                          onChange={(e) => setProductForm({...productForm, nombre: e.target.value})}
                          placeholder="Nombre del producto"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoría *</Label>
                        <Select
                          value={productForm.categoria_id || ''}
                          onValueChange={(value) => setProductForm({...productForm, categoria_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {dbCategories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descripcion_corta">Descripción Corta *</Label>
                      <Input
                        id="descripcion_corta"
                        value={productForm.descripcion_corta || ''}
                        onChange={(e) => setProductForm({...productForm, descripcion_corta: e.target.value})}
                        placeholder="Breve descripción para tarjetas de producto"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripción Completa</Label>
                      <Textarea
                        id="descripcion"
                        value={productForm.descripcion || ''}
                        onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
                        placeholder="Descripción detallada del producto"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="precio_diario">Precio Diario ($) *</Label>
                        <Input
                          id="precio_diario"
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.precio_diario || ''}
                          onChange={(e) => setProductForm({...productForm, precio_diario: parseFloat(e.target.value)})}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="precio_semanal">Precio Semanal ($)</Label>
                        <Input
                          id="precio_semanal"
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.precio_semanal || ''}
                          onChange={(e) => setProductForm({...productForm, precio_semanal: parseFloat(e.target.value)})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="precio_mensual">Precio Mensual ($)</Label>
                        <Input
                          id="precio_mensual"
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.precio_mensual || ''}
                          onChange={(e) => setProductForm({...productForm, precio_mensual: parseFloat(e.target.value)})}
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deposito">Depósito ($)</Label>
                        <Input
                          id="deposito"
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.deposito || ''}
                          onChange={(e) => setProductForm({...productForm, deposito: parseFloat(e.target.value)})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Imágenes *</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddImage}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Añadir Imagen
                        </Button>
                      </div>
                      
                      {productForm.imagenes && productForm.imagenes.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="relative flex-grow">
                            <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              value={url}
                              onChange={(e) => handleImageUrlChange(index, e.target.value)}
                              placeholder="URL de la imagen"
                              className="pl-9"
                            />
                          </div>
                          {(productForm.imagenes?.length || 0) > 1 && (
                            <Button 
                              type="button" 
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveImage(index)}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="disponible"
                          checked={productForm.disponible}
                          onCheckedChange={(checked) => setProductForm({...productForm, disponible: checked})}
                        />
                        <Label htmlFor="disponible">Disponible para alquilar</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="destacado"
                          checked={productForm.destacado}
                          onCheckedChange={(checked) => setProductForm({...productForm, destacado: checked})}
                        />
                        <Label htmlFor="destacado">Producto destacado</Label>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsProductDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-rental-500 hover:bg-rental-600" 
                      onClick={handleSaveProduct}
                    >
                      {isEditingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Panel de Categorías */}
            <TabsContent value="categorias">
              <div className="mb-6 flex justify-end">
                <Button 
                  className="bg-rental-500 hover:bg-rental-600"
                  onClick={() => {
                    setCategoryForm({
                      nombre: '',
                      descripcion: '',
                      imagen_url: ''
                    });
                    setIsEditingCategory(false);
                    setSelectedCategory(null);
                    setIsCategoryDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Categoría
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Categorías</CardTitle>
                  <CardDescription>
                    Administra las categorías de productos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dbCategories.length > 0 ? (
                        dbCategories.map(category => (
                          <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.nombre}</TableCell>
                            <TableCell>{category.descripcion}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            No hay categorías disponibles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Diálogo para crear/editar categoría */}
              <Dialog 
                open={isCategoryDialogOpen} 
                onOpenChange={setIsCategoryDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isEditingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                    </DialogTitle>
                    <DialogDescription>
                      Completa los detalles de la categoría.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cat_nombre">Nombre *</Label>
                      <Input
                        id="cat_nombre"
                        value={categoryForm.nombre || ''}
                        onChange={(e) => setCategoryForm({...categoryForm, nombre: e.target.value})}
                        placeholder="Nombre de la categoría"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cat_descripcion">Descripción</Label>
                      <Textarea
                        id="cat_descripcion"
                        value={categoryForm.descripcion || ''}
                        onChange={(e) => setCategoryForm({...categoryForm, descripcion: e.target.value})}
                        placeholder="Descripción de la categoría"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cat_imagen">URL de Imagen</Label>
                      <div className="relative">
                        <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="cat_imagen"
                          value={categoryForm.imagen_url || ''}
                          onChange={(e) => setCategoryForm({...categoryForm, imagen_url: e.target.value})}
                          placeholder="URL de la imagen (opcional)"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCategoryDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-rental-500 hover:bg-rental-600" 
                      onClick={handleSaveCategory}
                    >
                      {isEditingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Panel de Reservas */}
            <TabsContent value="reservas">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Reservas</CardTitle>
                  <CardDescription>
                    Administra todas las reservas de los clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-6 text-gray-500">
                    Funcionalidad de gestión de reservas en desarrollo
                  </p>
                </CardContent>
              </Card>
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
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Acceso Administrador
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Introduzca su usuario"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Introduzca su contraseña"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
