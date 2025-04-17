
import { Category } from "../types";
import { ShieldPlus, Droplets, Sandwich, FileText, Wrench, Phone, Shirt, Package } from "lucide-react";

export const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    food: "Gıda",
    water: "Su",
    medical: "Tıbbi",
    documents: "Belgeler",
    tools: "Aletler",
    communication: "İletişim",
    clothing: "Giyim",
    other: "Diğer",
  };

  return labels[category];
};

export const getCategoryIcon = (category: Category) => {
  const icons = {
    food: Sandwich,
    water: Droplets,
    medical: ShieldPlus,
    documents: FileText,
    tools: Wrench,
    communication: Phone,
    clothing: Shirt,
    other: Package,
  };

  return icons[category];
};

export const getCategoryOptions = () => {
  return [
    { value: "food", label: "Gıda" },
    { value: "water", label: "Su" },
    { value: "medical", label: "Tıbbi" },
    { value: "documents", label: "Belgeler" },
    { value: "tools", label: "Aletler" },
    { value: "communication", label: "İletişim" },
    { value: "clothing", label: "Giyim" },
    { value: "other", label: "Diğer" },
  ];
};

// 3D Icon style classes to enhance the category icons
export const getCategoryIconStyle = (category: Category) => {
  const baseClasses = "transform transition-all duration-300"; 
  
  const styles: Record<Category, string> = {
    food: `${baseClasses} text-amber-500 hover:text-amber-600 hover:scale-110`,
    water: `${baseClasses} text-blue-500 hover:text-blue-600 hover:scale-110`,
    medical: `${baseClasses} text-red-500 hover:text-red-600 hover:scale-110`,
    documents: `${baseClasses} text-gray-500 hover:text-gray-600 hover:scale-110`, 
    tools: `${baseClasses} text-zinc-600 hover:text-zinc-700 hover:scale-110`,
    communication: `${baseClasses} text-indigo-500 hover:text-indigo-600 hover:scale-110`,
    clothing: `${baseClasses} text-purple-500 hover:text-purple-600 hover:scale-110`,
    other: `${baseClasses} text-emerald-500 hover:text-emerald-600 hover:scale-110`,
  };

  return styles[category];
};
