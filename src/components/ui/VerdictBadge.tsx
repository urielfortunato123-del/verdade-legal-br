import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export type VerdictType = "confirmed" | "misleading" | "false" | "unverifiable";

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  showEmoji?: boolean;
  className?: string;
}

const verdictConfig: Record<VerdictType, {
  label: string;
  icon: typeof CheckCircle;
  emoji: string;
  className: string;
  description: string;
}> = {
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle,
    emoji: "✅",
    className: "verdict-confirmed",
    description: "Essa informação está de acordo com a lei vigente.",
  },
  misleading: {
    label: "Enganoso",
    icon: AlertTriangle,
    emoji: "⚠️",
    className: "verdict-misleading",
    description: "Existe base legal, mas a informação foi apresentada de forma incompleta ou distorcida.",
  },
  false: {
    label: "Falso",
    icon: XCircle,
    emoji: "❌",
    className: "verdict-false",
    description: "Não existe base legal que sustente essa afirmação.",
  },
  unverifiable: {
    label: "Não verificável",
    icon: HelpCircle,
    emoji: "❓",
    className: "verdict-unverifiable",
    description: "Não há dados suficientes para confirmar essa informação com base legal.",
  },
};

const sizeStyles = {
  sm: "px-3 py-1 text-xs gap-1.5",
  md: "px-4 py-1.5 text-sm gap-2",
  lg: "px-5 py-2 text-base gap-2",
  xl: "px-6 py-3 text-lg gap-3",
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export function VerdictBadge({
  verdict,
  size = "md",
  showIcon = true,
  showEmoji = false,
  className,
}: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-xl",
        config.className,
        sizeStyles[size],
        className
      )}
    >
      {showEmoji && <span>{config.emoji}</span>}
      {showIcon && !showEmoji && <Icon size={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}

export function VerdictIcon({
  verdict,
  size = 24,
  className,
}: {
  verdict: VerdictType;
  size?: number;
  className?: string;
}) {
  const Icon = verdictConfig[verdict].icon;
  const colorClass = {
    confirmed: "text-verde-brasil",
    misleading: "text-amarelo-progresso",
    false: "text-vermelho-alerta",
    unverifiable: "text-muted-foreground",
  }[verdict];

  return <Icon size={size} className={cn(colorClass, className)} />;
}

export function VerdictSeal({
  verdict,
  className,
}: {
  verdict: VerdictType;
  className?: string;
}) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;
  
  const bgColors = {
    confirmed: "bg-verde",
    misleading: "bg-gold",
    false: "bg-vermelho-alerta",
    unverifiable: "bg-secondary",
  };

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg",
        bgColors[verdict]
      )}>
        <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-2xl font-display font-bold text-card-foreground">
        {config.emoji} {config.label}
      </span>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
        {config.description}
      </p>
    </div>
  );
}

export { verdictConfig };
