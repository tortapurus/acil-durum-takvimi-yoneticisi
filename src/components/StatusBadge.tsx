
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ItemStatus } from "@/types";
import { ShieldCheck, AlertTriangle, ShieldX } from "lucide-react";

interface StatusBadgeProps {
  status: ItemStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  showIcon = true,
  className,
}) => {
  const getStatusInfo = (status: ItemStatus) => {
    switch (status) {
      case "safe":
        return {
          label: "Güvenli",
          icon: ShieldCheck,
          className: "status-safe",
        };
      case "warning":
        return {
          label: "Yaklaşıyor",
          icon: AlertTriangle,
          className: "status-warning",
        };
      case "danger":
        return {
          label: "Süresi Dolmuş",
          icon: ShieldX,
          className: "status-danger",
        };
      default:
        return {
          label: "Bilinmiyor",
          icon: AlertTriangle,
          className: "",
        };
    }
  };

  const { label, icon: Icon, className: statusClassName } = getStatusInfo(status);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium flex items-center gap-1",
        statusClassName,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </Badge>
  );
};
