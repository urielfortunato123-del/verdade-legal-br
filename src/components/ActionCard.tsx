import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

const variantStyles = {
  default: "bg-card hover:bg-secondary/50 border-border",
  primary: "hero-gradient text-primary-foreground border-transparent hover:opacity-95",
  accent: "gold-gradient text-accent-foreground border-transparent hover:opacity-95",
};

export function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  variant = "default",
  className,
}: ActionCardProps) {
  const isPrimary = variant === "primary" || variant === "accent";

  return (
    <Link
      to={href}
      className={cn(
        "group relative flex flex-col p-6 rounded-xl border transition-all duration-300",
        "shadow-card hover:shadow-elevated",
        "transform hover:-translate-y-1",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
          isPrimary
            ? "bg-primary-foreground/20"
            : "bg-primary/10"
        )}
      >
        <Icon
          size={24}
          className={cn(
            isPrimary ? "text-primary-foreground" : "text-primary"
          )}
        />
      </div>

      <h3
        className={cn(
          "font-display font-semibold text-lg mb-2",
          isPrimary ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          "text-sm leading-relaxed",
          isPrimary
            ? "text-primary-foreground/80"
            : "text-muted-foreground"
        )}
      >
        {description}
      </p>

      <div
        className={cn(
          "absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isPrimary
            ? "bg-primary-foreground/20"
            : "bg-primary/10"
        )}
      >
        <svg
          className={cn(
            "w-4 h-4 transform group-hover:translate-x-0.5 transition-transform",
            isPrimary ? "text-primary-foreground" : "text-primary"
          )}
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
