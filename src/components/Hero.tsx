import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const Hero = () => {
  return <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1400&auto=format&fit=crop" 
          srcSet="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop 800w,
                  https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1400&auto=format&fit=crop 1400w,
                  https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1920&auto=format&fit=crop 1920w"
          sizes="100vw"
          alt="Trastero lleno de cajas y productos almacenados" 
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">¿Por qué comprar cuando puedes alquilar?</h1>
          <p className="text-lg sm:text-xl mb-8 text-white/90">Ahórrate el trastero y accede a productos premium a una fracción del costo. Desde electrónica hasta equipamiento para exteriores, tenemos todo lo que necesitas.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/products">
              <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100 w-full sm:w-auto">
                Explorar productos
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white w-full sm:w-auto bg-transparent">
                Cómo funciona
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;