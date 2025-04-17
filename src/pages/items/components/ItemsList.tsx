
import React from "react";
import { Item } from "@/types";
import { ItemCard } from "@/components/ItemCard";
import { useNavigate } from "react-router-dom";

interface ItemsListComponentProps {
  items: Item[];
}

export const ItemsListComponent: React.FC<ItemsListComponentProps> = ({ items }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={() => navigate(`/items/${item.id}`)}
        />
      ))}
    </div>
  );
};
