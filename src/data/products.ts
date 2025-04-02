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
    name: "Professional DSLR Camera",
    category: "Electronics",
    description: "High-end DSLR camera with 4K video capabilities, perfect for professional photography and videography projects. Includes multiple lenses, tripod, and carrying case.",
    shortDescription: "Professional-grade camera for stunning photos and videos",
    dailyPrice: 75,
    weeklyPrice: 400,
    monthlyPrice: 1200,
    deposit: 500,
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
    name: "Mountain Bike",
    category: "Sports",
    description: "Premium carbon frame mountain bike with front and rear suspension, hydraulic disc brakes, and 29-inch wheels. Perfect for trail riding and mountain adventures.",
    shortDescription: "High-performance mountain bike for all terrains",
    dailyPrice: 45,
    weeklyPrice: 200,
    monthlyPrice: 600,
    deposit: 300,
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
    name: "Camping Gear Set",
    category: "Outdoors",
    description: "Complete camping set including a 4-person tent, sleeping bags, portable stove, lanterns, and cooking utensils. Everything you need for your next outdoor adventure.",
    shortDescription: "Complete camping kit for your outdoor adventures",
    dailyPrice: 60,
    weeklyPrice: 300,
    monthlyPrice: 900,
    deposit: 200,
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
    name: "DJ Equipment",
    category: "Music",
    description: "Professional DJ setup including controller, speakers, headphones, and lighting effects. Perfect for parties, events, and aspiring DJs.",
    shortDescription: "Pro DJ gear for parties and events",
    dailyPrice: 120,
    weeklyPrice: 500,
    monthlyPrice: 1500,
    deposit: 600,
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
    name: "Drone with 4K Camera",
    category: "Electronics",
    description: "High-performance drone with 4K camera, 30-minute flight time, obstacle avoidance, and follow-me features. Ideal for aerial photography and videography.",
    shortDescription: "Capture breathtaking aerial footage with this high-tech drone",
    dailyPrice: 85,
    weeklyPrice: 450,
    monthlyPrice: 1300,
    deposit: 500,
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
    name: "Party Lighting System",
    category: "Events",
    description: "Complete party lighting system with DMX controller, moving heads, laser effects, and sound-activated modes. Transform any venue into a professional nightclub.",
    shortDescription: "Transform any space with professional lighting effects",
    dailyPrice: 90,
    weeklyPrice: 400,
    monthlyPrice: 1100,
    deposit: 300,
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
