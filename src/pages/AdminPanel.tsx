
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded admin credentials (in a real app, this would be more secure)
    if (username === 'admin' && password === 'cousateca2024') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  // If logged in, show admin dashboard
  if (isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gestión de Productos</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Añadir Nuevo Producto
                </Button>
                <Button variant="outline" className="w-full">
                  Editar Productos Existentes
                </Button>
                <Button variant="outline" className="w-full">
                  Eliminar Productos
                </Button>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gestión de Categorías</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Añadir Nueva Categoría
                </Button>
                <Button variant="outline" className="w-full">
                  Editar Categorías
                </Button>
                <Button variant="outline" className="w-full">
                  Eliminar Categorías
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button 
              variant="destructive" 
              onClick={() => setIsLoggedIn(false)}
            >
              Cerrar Sesión
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Login form
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
