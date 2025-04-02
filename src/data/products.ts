
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  deposit: number;
  images: string[];
  availability: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cámara DSLR Profesional",
    category: "Electrónica",
    description: "Cámara DSLR de alta gama con capacidades de video 4K, perfecta para proyectos profesionales de fotografía y videografía. Incluye múltiples lentes, trípode y estuche de transporte.",
    shortDescription: "Cámara profesional para fotos y videos impresionantes",
    dailyPrice: 65,
    weeklyPrice: 350,
    monthlyPrice: 1050,
    deposit: 450,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1738&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=1470&auto=format&fit=crop",
    ],
    availability: true,
    featured: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Bicicleta de Montaña",
    category: "Deportes",
    description: "Bicicleta de montaña premium con cuadro de carbono, suspensión delantera y trasera, frenos de disco hidráulicos y ruedas de 29 pulgadas. Perfecta para rutas de montaña y aventuras.",
    shortDescription: "Bicicleta de alto rendimiento para todo tipo de terrenos",
    dailyPrice: 40,
    weeklyPrice: 180,
    monthlyPrice: 525,
    deposit: 260,
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1740&auto=format&fit=crop",
    ],
    availability: true,
    featured: true,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Equipo de Camping Completo",
    category: "Aire Libre",
    description: "Equipo completo de camping que incluye una tienda para 4 personas, sacos de dormir, estufa portátil, linternas y utensilios de cocina. Todo lo que necesitas para tu próxima aventura al aire libre.",
    shortDescription: "Kit completo de camping para tus aventuras al aire libre",
    dailyPrice: 55,
    weeklyPrice: 260,
    monthlyPrice: 790,
    deposit: 175,
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1738&auto=format&fit=crop",
    ],
    availability: true,
    featured: true,
    rating: 4.5,
    reviewCount: 67,
  },
  {
    id: "4",
    name: "Equipo de DJ",
    category: "Música",
    description: "Configuración profesional de DJ que incluye controlador, altavoces, auriculares y efectos de iluminación. Perfecto para fiestas, eventos y DJs aspirantes.",
    shortDescription: "Equipo profesional de DJ para fiestas y eventos",
    dailyPrice: 105,
    weeklyPrice: 440,
    monthlyPrice: 1320,
    deposit: 525,
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571066811602-716837d681de?q=80&w=1744&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?q=80&w=1738&auto=format&fit=crop",
    ],
    availability: true,
    featured: false,
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: "5",
    name: "Dron con Cámara 4K",
    category: "Electrónica",
    description: "Dron de alto rendimiento con cámara 4K, 30 minutos de tiempo de vuelo, evitación de obstáculos y funciones de seguimiento. Ideal para fotografía y videografía aérea.",
    shortDescription: "Captura imágenes aéreas impresionantes con este dron de alta tecnología",
    dailyPrice: 75,
    weeklyPrice: 395,
    monthlyPrice: 1140,
    deposit: 440,
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524143986875-3b098d78b363?q=80&w=1740&auto=format&fit=crop",
    ],
    availability: true,
    featured: true,
    rating: 4.6,
    reviewCount: 58,
  },
  {
    id: "6",
    name: "Sistema de Iluminación para Fiestas",
    category: "Eventos",
    description: "Sistema completo de iluminación para fiestas con controlador DMX, cabezales móviles, efectos láser y modos activados por sonido. Transforma cualquier lugar en una discoteca profesional.",
    shortDescription: "Transforma cualquier espacio con efectos de iluminación profesionales",
    dailyPrice: 80,
    weeklyPrice: 350,
    monthlyPrice: 965,
    deposit: 260,
    images: [
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1641580529558-a89dae3b92db?q=80&w=1740&auto=format&fit=crop",
    ],
    availability: true,
    featured: false,
    rating: 4.7,
    reviewCount: 33,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};
