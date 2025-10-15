
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, Database, User, Wifi, RefreshCw } from "lucide-react";

const AdminDebugPanel: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      auth: {},
      database: {},
      permissions: {},
      realtime: {}
    };

    try {
      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      diagnostics.auth = {
        user: user ? { id: user.id, email: user.email } : null,
        error: authError?.message
      };

      if (user) {
        // Verificar perfil y permisos
        try {
          const { data: profile, error: profileError } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          // Check admin role from user_roles table
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          diagnostics.permissions = {
            profile,
            isAdmin: !!userRole,
            error: profileError?.message
          };
        } catch (error: any) {
          diagnostics.permissions.error = error.message;
        }

        // Verificar acceso a productos
        try {
          const { data: products, error: productsError } = await supabase
            .from('productos')
            .select('count')
            .limit(1);
          
          diagnostics.database.products = {
            accessible: !productsError,
            error: productsError?.message
          };
        } catch (error: any) {
          diagnostics.database.products = {
            accessible: false,
            error: error.message
          };
        }

        // Verificar acceso a categorías
        try {
          const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('count')
            .limit(1);
          
          diagnostics.database.categories = {
            accessible: !categoriesError,
            error: categoriesError?.message
          };
        } catch (error: any) {
          diagnostics.database.categories = {
            accessible: false,
            error: error.message
          };
        }
      }

      // Verificar conexión realtime
      const channel = supabase.channel('test-connection');
      const channelStatus = channel.state;
      diagnostics.realtime = {
        status: channelStatus,
        connected: channelStatus === 'joined'
      };
      
      supabase.removeChannel(channel);

    } catch (error: any) {
      diagnostics.error = error.message;
    }

    setDebugInfo(diagnostics);
    setIsLoading(false);
  };

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? "outline" : "destructive"}>
        {condition ? `✅ ${trueText}` : `❌ ${falseText}`}
      </Badge>
    );
  };

  return (
    <Card className="mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">🔧 Panel de Diagnóstico</CardTitle>
                <CardDescription>
                  Herramientas de debugging para diagnosticar problemas del panel de administración
                </CardDescription>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={runDiagnostics}
                disabled={isLoading}
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Ejecutando Diagnóstico...' : 'Ejecutar Diagnóstico Completo'}
              </Button>

              {debugInfo && (
                <ScrollArea className="h-96 w-full rounded border p-4">
                  <div className="space-y-4">
                    {/* Estado de Autenticación */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Autenticación
                      </h4>
                      {getStatusBadge(!!debugInfo.auth.user, 'Usuario autenticado', 'No autenticado')}
                      {debugInfo.auth.user && (
                        <div className="text-sm text-gray-600 ml-6">
                          <p>ID: {debugInfo.auth.user.id}</p>
                          <p>Email: {debugInfo.auth.user.email}</p>
                        </div>
                      )}
                      {debugInfo.auth.error && (
                        <p className="text-sm text-red-600 ml-6">Error: {debugInfo.auth.error}</p>
                      )}
                    </div>

                    {/* Permisos */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Permisos de Administrador
                      </h4>
                      {getStatusBadge(debugInfo.permissions.isAdmin, 'Admin verificado', 'Sin permisos de admin')}
                      {debugInfo.permissions.profile && (
                        <div className="text-sm text-gray-600 ml-6">
                          <p>Rol: {debugInfo.permissions.profile.role}</p>
                          <p>Nombre: {debugInfo.permissions.profile.nombre || 'No especificado'}</p>
                        </div>
                      )}
                      {debugInfo.permissions.error && (
                        <p className="text-sm text-red-600 ml-6">Error: {debugInfo.permissions.error}</p>
                      )}
                    </div>

                    {/* Acceso a Base de Datos */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Acceso a Base de Datos
                      </h4>
                      
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Productos:</span>
                          {getStatusBadge(debugInfo.database.products?.accessible, 'Accesible', 'Sin acceso')}
                        </div>
                        {debugInfo.database.products?.error && (
                          <p className="text-xs text-red-600 ml-4">Error: {debugInfo.database.products.error}</p>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Categorías:</span>
                          {getStatusBadge(debugInfo.database.categories?.accessible, 'Accesible', 'Sin acceso')}
                        </div>
                        {debugInfo.database.categories?.error && (
                          <p className="text-xs text-red-600 ml-4">Error: {debugInfo.database.categories.error}</p>
                        )}
                      </div>
                    </div>

                    {/* Estado Realtime */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Conexión en Tiempo Real
                      </h4>
                      {getStatusBadge(debugInfo.realtime.connected, 'Conectado', 'Desconectado')}
                      <div className="text-sm text-gray-600 ml-6">
                        <p>Estado: {debugInfo.realtime.status}</p>
                      </div>
                    </div>

                    {/* Información del Sistema */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">📊 Información del Sistema</h4>
                      <div className="text-sm text-gray-600 ml-6">
                        <p>Timestamp: {debugInfo.timestamp}</p>
                        <p>URL actual: {window.location.pathname}</p>
                        <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
                      </div>
                    </div>

                    {/* Logs de Consola */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">📝 Consejos de Troubleshooting</h4>
                      <div className="text-sm text-gray-600 ml-6 space-y-1">
                        <p>• Abre las herramientas de desarrollador (F12) para ver logs detallados</p>
                        <p>• Verifica que el usuario tenga rol 'admin' en la tabla perfiles</p>
                        <p>• Asegúrate de que las políticas RLS estén configuradas correctamente</p>
                        <p>• Comprueba la conexión a internet si hay errores de red</p>
                      </div>
                    </div>

                    {/* Raw Data para debugging avanzado */}
                    <details className="mt-4">
                      <summary className="cursor-pointer font-semibold text-sm">
                        🔍 Datos Completos de Diagnóstico (Avanzado)
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                    </details>
                  </div>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AdminDebugPanel;
