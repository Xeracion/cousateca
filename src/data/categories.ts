
export interface Category {
  id: string;
  name: string;
  nombre_es: string;
  icon: string;
  description: string;
  descripcion_es: string;
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    nombre_es: "Electrónica",
    icon: "laptop",
    description: "Cameras, drones, computers, and other electronic equipment",
    descripcion_es: "Cámaras, drones, ordenadores y otros equipos electrónicos"
  },
  {
    id: "sports",
    name: "Sports",
    nombre_es: "Deportes",
    icon: "bicycle",
    description: "Bikes, surfboards, skiing equipment, and more",
    descripcion_es: "Bicicletas, tablas de surf, equipo de esquí y más"
  },
  {
    id: "outdoors",
    name: "Outdoors",
    nombre_es: "Aire Libre",
    icon: "tent",
    description: "Camping gear, hiking equipment, and outdoor accessories",
    descripcion_es: "Equipo de camping, senderismo y accesorios para exteriores"
  },
  {
    id: "events",
    name: "Events",
    nombre_es: "Eventos",
    icon: "party-popper",
    description: "Party supplies, sound systems, and event equipment",
    descripcion_es: "Artículos para fiestas, sistemas de sonido y equipamiento para eventos"
  },
  {
    id: "music",
    name: "Music",
    nombre_es: "Música",
    icon: "music",
    description: "Instruments, DJ equipment, and audio gear",
    descripcion_es: "Instrumentos, equipo de DJ y audio"
  },
  {
    id: "tools",
    name: "Tools",
    nombre_es: "Herramientas",
    icon: "hammer",
    description: "Power tools, garden equipment, and specialized tools",
    descripcion_es: "Herramientas eléctricas, equipo de jardín y herramientas especializadas"
  }
];
