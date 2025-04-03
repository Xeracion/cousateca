
import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sara Jiménez",
    role: "Organizadora de eventos",
    content: "Cousateca ha sido un cambio revolucionario para mi negocio de organización de eventos. La calidad de su equipamiento es excepcional, y el proceso de alquiler es muy sencillo. ¡Me encanta especialmente el servicio de entrega y recogida!",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "David López",
    role: "Entusiasta de la fotografía",
    content: "Pude probar equipos de cámara caros antes de hacer una compra. El personal era conocedor y me ayudó a elegir el equipo adecuado para mis necesidades. ¡Muy recomendable!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Elena Moreno",
    role: "Aventurera de fin de semana",
    content: "Alquilé equipo de camping para un viaje de última hora y todo estaba en perfectas condiciones. Los precios eran razonables y me ahorró tener que comprar equipamiento que rara vez usaría.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            No solo tomes nuestra palabra. Esto es lo que los clientes piensan sobre su experiencia con Cousateca.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
