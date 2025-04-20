
import { Category, CustomCategory } from "../types";
import { ShieldPlus, Droplets, Sandwich, FileText, Wrench, Phone, Shirt, Package } from "lucide-react";

// Updated to accept string instead of just Category enum
export const getCategoryLabel = (category: string): string => {
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

  // Check if it's a standard category
  if (category in labels) {
    return labels[category as Category];
  }
  
  // For custom categories return the category itself as a fallback
  return category;
};

// Updated to accept string instead of just Category enum
export const getCategoryIcon = (category: string) => {
  const icons: Record<Category, any> = {
    food: Sandwich,
    water: Droplets,
    medical: ShieldPlus,
    documents: FileText,
    tools: Wrench,
    communication: Phone,
    clothing: Shirt,
    other: Package,
  };

  // Return the icon if it exists, otherwise return the default "other" icon
  return category in icons ? icons[category as Category] : Package;
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

// Updated to accept string instead of just Category enum
export const getCategoryIconStyle = (category: string) => {
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

  // Return the style if it exists, otherwise return a default style
  return category in styles ? styles[category as Category] : styles.other;
};
