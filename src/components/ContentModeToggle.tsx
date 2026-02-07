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
        "flex rounded-lg border border-border bg-secondary/30 p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange("news_tv")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          mode === "news_tv"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Tv className="w-4 h-4" />
        <span>Notícia/TV</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("document")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          mode === "document"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <FileText className="w-4 h-4" />
        <span>Documento</span>
      </button>
    </div>
  );
}
