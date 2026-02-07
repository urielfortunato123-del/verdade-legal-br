import { cn } from "@/lib/utils";
import { Tv, FileText } from "lucide-react";

interface ContentModeToggleProps {
  mode: "news_tv" | "document";
  onChange: (mode: "news_tv" | "document") => void;
  className?: string;
}

export function ContentModeToggle({
  mode,
  onChange,
  className,
}: ContentModeToggleProps) {
  return (
    <div
      className={cn(
        "flex rounded-xl border-2 border-border bg-muted/30 p-1.5",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange("news_tv")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200",
          mode === "news_tv"
            ? "bg-card text-card-foreground shadow-md"
            : "text-muted-foreground hover:text-card-foreground"
        )}
      >
        <span className="text-lg">📺</span>
        <span>Notícia/TV</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("document")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200",
          mode === "document"
            ? "bg-card text-card-foreground shadow-md"
            : "text-muted-foreground hover:text-card-foreground"
        )}
      >
        <span className="text-lg">📄</span>
        <span>Documento</span>
      </button>
    </div>
  );
}
