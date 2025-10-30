import React from "react";
import { TrendingUp, Package, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Transparency = () => {
  const stats = [
    {
      icon: Package,
      label: "Préstamos Realizados",
      value: "53",
      description: "Objetos prestados a la comunidad",
      trend: "+12 este mes"
    },
    {
      icon: Users,
      label: "Usuarios Activos",
      value: "28",
      description: "Miembros de la comunidad",
      trend: "+5 nuevos"
    },
    {
      icon: TrendingUp,
      label: "Tasa de Devolución",
      value: "98%",
      description: "Objetos devueltos a tiempo",
      trend: "Excelente"
    },
    {
      icon: Calendar,
      label: "Días de Ahorro",
      value: "340",
      description: "Días de uso compartido",
      trend: "Impacto positivo"
    }
  ];

  const recentUpdates = [
    {
      date: "15 Enero 2025",
      title: "Nuevas herramientas de jardinería",
      description: "Añadidas 5 nuevas herramientas para la temporada de primavera"
    },
    {
      date: "8 Enero 2025",
      title: "Equipamiento deportivo",
      description: "Incorporados kayaks y material de camping"
    },
    {
      date: "22 Diciembre 2024",
      title: "Electrodomésticos",
      description: "Nuevas aspiradoras y equipos de limpieza disponibles"
    }
  ];

  return (
    <section id="transparencia" className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Transparencia y Estadísticas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compartimos abiertamente el impacto de nuestra comunidad de préstamo compartido
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {stat.description}
                  </p>
                  <p className="text-xs font-medium text-primary">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actualizaciones del Catálogo */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            Últimas Actualizaciones del Catálogo
          </h3>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {update.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {update.description}
                      </CardDescription>
                    </div>
                    <time className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {update.date}
                    </time>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-muted/30">
            <CardHeader>
              <CardTitle className="text-xl">¿Tienes preguntas sobre nuestros datos?</CardTitle>
              <CardDescription>
                Estamos comprometidos con la transparencia total. Contáctanos en{" "}
                <a 
                  href="mailto:info@xeracion.org" 
                  className="text-primary hover:underline font-medium"
                >
                  info@xeracion.org
                </a>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Transparency;
