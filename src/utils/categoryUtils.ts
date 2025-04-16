
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
