
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TextRotate } from "@/components/ui/text-rotate";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { useIsMobile } from "@/hooks/use-mobile";

// Product images from our catalog
const productImages = [
  {
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Cámara DSLR Canon",
  },
  {
    url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Bicicleta de Montaña",
  },
  {
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Tienda de Campaña",
  },
  {
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Equipo de Sonido",
  },
  {
    url: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Guitarra Eléctrica",
  },
  {
    url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Taladro Profesional",
  },
  {
    url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1740&auto=format&fit=crop",
    title: "Equipamiento de Exterior",
  },
  {
    url: "https://images.unsplash.com/photo-1689553079282-45df1b35741b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Equipo para Eventos",
  },
];

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <section className="w-full min-h-screen overflow-hidden flex flex-col items-center justify-center relative">
      <Floating sensitivity={-0.5} className="h-full w-full">
        <FloatingElement
          depth={0.5}
          className="top-[15%] left-[2%] md:top-[25%] md:left-[5%]"
        >
          <motion.img
            src={productImages[0].url}
            alt={productImages[0].title}
            className="w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 lg:w-32 lg:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-[3deg] shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={1}
          className="top-[0%] left-[8%] md:top-[6%] md:left-[11%]"
        >
          <motion.img
            src={productImages[1].url}
            alt={productImages[1].title}
            className="w-40 h-28 sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-60 lg:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-12 shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={4}
          className="top-[90%] left-[6%] md:top-[80%] md:left-[8%]"
        >
          <motion.img
            src={productImages[2].url}
            alt={productImages[2].title}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-64 lg:h-64 object-cover -rotate-[4deg] hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={2}
          className="top-[0%] left-[87%] md:top-[2%] md:left-[83%]"
        >
          <motion.img
            src={productImages[3].url}
            alt={productImages[3].title}
            className="w-40 h-36 sm:w-48 sm:h-44 md:w-60 md:h-52 lg:w-64 lg:h-56 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[6deg] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={1}
          className="top-[78%] left-[83%] md:top-[68%] md:left-[83%]"
        >
          <motion.img
            src={productImages[4].url}
            alt={productImages[4].title}
            className="w-44 h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[19deg] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          />
        </FloatingElement>
      </Floating>

      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>

      {/* Hero content - using the original hero text */}
      <div className="flex flex-col justify-center items-center w-full sm:w-[90%] md:w-[800px] lg:w-[900px] z-20 px-4 sm:px-6">
        <motion.div
          className="max-w-2xl text-white"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
          >
            <span>Alquila productos </span>
            <TextRotate
              texts={[
                "de calidad",
                "premium",
                "exclusivos",
                "profesionales",
                "para cualquier ocasión"
              ]}
              mainClassName="overflow-hidden text-rental-300 inline-flex"
              staggerDuration={0.03}
              staggerFrom="last"
              rotationInterval={3000}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            />
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl mb-8 text-white/90"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.5 }}
          >
            ¿Por qué comprar cuando puedes alquilar? Accede a productos premium a una fracción del costo.
            Desde electrónica hasta equipamiento para exteriores, tenemos todo lo que necesitas.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.7 }}
          >
            <Link to="/products">
              <Button 
                size="lg" 
                className="bg-white text-rental-500 hover:bg-gray-100 w-full sm:w-auto"
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", damping: 30, stiffness: 400 }
                } as any}
              >
                Explorar productos
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white w-full sm:w-auto bg-transparent hover:bg-white/10"
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", damping: 30, stiffness: 400 }
                } as any}
              >
                Cómo funciona
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
