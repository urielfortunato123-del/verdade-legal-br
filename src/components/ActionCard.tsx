import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionCardProps {
  icon: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  href: string;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

export function ActionCard({
  icon: Icon,
  emoji,
  title,
  description,
  href,
  variant = "default",
  className,
}: ActionCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative flex flex-col p-6 rounded-2xl transition-all duration-300",
        "bg-card shadow-card hover:shadow-elevated",
        "transform hover:-translate-y-1 hover:scale-[1.02]",
        "border-2 border-transparent hover:border-verde-brasil/30",
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md",
            variant === "primary" ? "bg-verde" : 
            variant === "accent" ? "bg-gold" : 
            "bg-azul-ordem"
          )}
        >
          {emoji ? (
            <span className="text-2xl">{emoji}</span>
          ) : (
            <Icon size={26} className="text-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display font-bold text-lg text-card-foreground mb-2 group-hover:text-verde-brasil transition-colors">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Arrow indicator */}
      <div
        className={cn(
          "absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center",
          "bg-muted/50 opacity-0 group-hover:opacity-100 transition-all duration-300",
          "group-hover:bg-verde-brasil"
        )}
      >
        <svg
          className="w-4 h-4 text-card-foreground group-hover:text-white transform group-hover:translate-x-0.5 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
