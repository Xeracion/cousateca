import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const CallToAction = () => {
  return <section className="bg-rental-500 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          ¿Listo para alquilar productos de calidad?
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">Conviértete en alguien que ahorra dinero alquilando en lugar de comprar. 
¡Explora nuestro catálogo de Cousas!</p>
        <Link to="/auth">
          <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100">
            Únete y explora
          </Button>
        </Link>
      </div>
    </section>;
};
export default CallToAction;