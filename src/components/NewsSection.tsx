import { useState } from "react";
import { useNews, NewsCategory } from "@/hooks/useNews";
import { Newspaper, ExternalLink, RefreshCw, Clock, Landmark, TrendingUp, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const categories: { id: NewsCategory; label: string; icon: typeof Globe }[] = [
  { id: "geral", label: "Geral", icon: Globe },
  { id: "politica", label: "Governo", icon: Landmark },
  { id: "economia", label: "Economia", icon: TrendingUp },
];

export function NewsSection() {
  const [category, setCategory] = useState<NewsCategory>("geral");
  const { data: news, isLoading, error, refetch, isFetching } = useNews(category);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch {
      return "";
    }
  };

  const getSourceColor = (source: string) => {
    if (source.includes("G1")) return "bg-red-500/20 text-red-300";
    if (source.includes("Folha")) return "bg-blue-500/20 text-blue-300";
    if (source.includes("UOL")) return "bg-yellow-500/20 text-yellow-300";
    if (source.includes("Senado")) return "bg-green-500/20 text-green-300";
    return "bg-white/10 text-white/70";
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-lg">
              Notícias do Brasil
            </h2>
            <p className="text-sm text-white/50">Atualizadas em tempo real</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all hover:scale-105 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-5 h-5 text-white/70 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              category === cat.id
                ? "bg-secondary text-secondary-foreground"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
            )}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="quick-item-glass animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-white/50 text-sm mb-3">
            Não foi possível carregar as notícias
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/90 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {news?.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-item-glass block group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getSourceColor(item.source)}`}
                  >
                    {item.source}
                  </span>
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.pubDate)}
                  </span>
                </div>
                <h3 className="font-medium text-white/90 text-sm leading-snug mb-1 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-white/50 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0 ml-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
