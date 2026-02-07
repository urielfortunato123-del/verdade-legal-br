import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export type VerdictType = "confirmed" | "misleading" | "false" | "unverifiable";

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const verdictConfig: Record<VerdictType, {
  label: string;
  icon: typeof CheckCircle;
  emoji: string;
  className: string;
}> = {
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle,
    emoji: "✅",
    className: "verdict-confirmed",
  },
  misleading: {
    label: "Enganoso",
    icon: AlertTriangle,
    emoji: "⚠️",
    className: "verdict-misleading",
  },
  false: {
    label: "Falso",
    icon: XCircle,
    emoji: "❌",
    className: "verdict-false",
  },
  unverifiable: {
    label: "Não verificável",
    icon: HelpCircle,
    emoji: "❓",
    className: "verdict-unverifiable",
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 18,
};

export function VerdictBadge({
  verdict,
  size = "md",
  showIcon = true,
  className,
}: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.className,
        sizeStyles[size],
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}

export function VerdictIcon({
  verdict,
  size = 20,
  className,
}: {
  verdict: VerdictType;
  size?: number;
  className?: string;
}) {
  const Icon = verdictConfig[verdict].icon;
  const colorClass = {
    confirmed: "text-verdict-confirmed",
    misleading: "text-verdict-misleading",
    false: "text-verdict-false",
    unverifiable: "text-verdict-unverifiable",
  }[verdict];

  return <Icon size={size} className={cn(colorClass, className)} />;
}
