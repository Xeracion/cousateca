
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "laptop",
    description: "Cameras, drones, computers, and other electronic equipment"
  },
  {
    id: "sports",
    name: "Sports",
    icon: "bicycle",
    description: "Bikes, surfboards, skiing equipment, and more"
  },
  {
    id: "outdoors",
    name: "Outdoors",
    icon: "tent",
    description: "Camping gear, hiking equipment, and outdoor accessories"
  },
  {
    id: "events",
    name: "Events",
    icon: "party-popper",
    description: "Party supplies, sound systems, and event equipment"
  },
  {
    id: "music",
    name: "Music",
    icon: "music",
    description: "Instruments, DJ equipment, and audio gear"
  },
  {
    id: "tools",
    name: "Tools",
    icon: "hammer",
    description: "Power tools, garden equipment, and specialized tools"
  }
];
