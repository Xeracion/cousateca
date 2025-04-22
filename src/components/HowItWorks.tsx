import React from "react";
import { Search, Calendar, User, ThumbsUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-rental-500" />,
      title: "Buscar y seleccionar",
      description: "Explora nuestro catálogo de productos de alta calidad y elige lo que necesitas."
    },
    {
      icon: <Calendar className="h-10 w-10 text-rental-500" />,
      title: "Elegir período de alquiler",
      description: "Selecciona las fechas de alquiler deseadas y revisa las opciones de precios."
    },
    {
      icon: <User className="h-10 w-10 text-rental-500" />,
      title: "Recoger y devolver",
      description: "Visita nuestra ubicación en Rúa Almendra 9, Ferrol, para recoger y devolver los productos."
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-rental-500" />,
      title: "Disfrutar y devolver",
      description: "Utiliza los productos y devuélvelos en buen estado cuando finalice tu alquiler."
    }
  ];
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Cómo funciona Cousateca</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Alquilar productos de alta calidad nunca ha sido tan fácil. 
            Nuestro sencillo proceso te permite obtener lo que necesitas, cuando lo necesitas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-rental-50 p-4 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute mt-10 ml-56">
                  <div className="h-0.5 w-12 bg-rental-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
