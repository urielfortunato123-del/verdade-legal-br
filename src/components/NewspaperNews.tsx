import { useState } from "react";
import { useNews, NewsCategory } from "@/hooks/useNews";
import { useVerifyNews, VerdictType } from "@/hooks/useVerifyNews";
import { useAnalyzeNews, AnalysisResult } from "@/hooks/useAnalyzeNews";
import { AnalysisModal } from "@/components/AnalysisModal";
import {
  RefreshCw,
  Clock,
  Landmark,
  TrendingUp,
  Globe,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileText,
  Dumbbell,
  Smartphone,
  Film,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const categories: { id: NewsCategory; label: string; icon: typeof Globe }[] = [
  { id: "geral", label: "Geral", icon: Globe },
  { id: "politica", label: "Governo", icon: Landmark },
  { id: "economia", label: "Economia", icon: TrendingUp },
  { id: "esportes", label: "Esportes", icon: Dumbbell },
  { id: "tecnologia", label: "Tech", icon: Smartphone },
  { id: "entretenimento", label: "Cultura", icon: Film },
];

const verdictConfig: Record<
  VerdictType,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle2,
    className: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-500/30",
  },
  misleading: {
    label: "Enganoso",
    icon: AlertTriangle,
    className: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500/30",
  },
  false: {
    label: "Falso",
    icon: XCircle,
    className: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30",
  },
  unverifiable: {
    label: "Não verificável",
    icon: HelpCircle,
    className: "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500/30",
  },
};

export function NewspaperNews() {
  const [category, setCategory] = useState<NewsCategory>("geral");
  const [modalData, setModalData] = useState<AnalysisResult | null>(null);
  const { data: news, isLoading, error, refetch, isFetching } = useNews(category);
  const { verify, isVerifying, results } = useVerifyNews();
  const { analyze, isAnalyzing, results: analysisResults } = useAnalyzeNews();

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch {
      return "";
    }
  };

  const handleVerify = async (
    e: React.MouseEvent, idx: number,
    item: { title: string; description: string; source: string; link: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    await verify(`${category}-${idx}`, item.title, item.description, item.source, item.link);
  };

  const handleAnalyze = async (
    e: React.MouseEvent, idx: number,
    item: { title: string; description: string; source: string; link: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await analyze(`${category}-${idx}`, item.title, item.description, item.source, item.link);
    if (result) setModalData(result);
  };

  const featuredNews = news?.[0];
  const otherNews = news?.slice(1);

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif font-black text-2xl md:text-3xl text-foreground">
          Últimas Notícias
        </h2>
        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching} className="text-xs">
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Category Tabs - newspaper section tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1 border-b border-foreground/10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 font-sans",
              category === cat.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border-b border-border animate-pulse">
              <div className="h-5 bg-muted rounded w-3/4 mb-3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 border border-border rounded-lg">
          <p className="text-muted-foreground text-sm mb-3 font-body italic">Não foi possível carregar as notícias</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">Tentar novamente</Button>
        </div>
      ) : (
        <div>
          {/* Featured Story */}
          {featuredNews && (
            <div className="mb-6 pb-6 border-b-2 border-foreground/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive font-sans">
                  Destaque
                </span>
                <span className="text-[10px] text-muted-foreground font-sans">
                  {featuredNews.source} • {formatDate(featuredNews.pubDate)}
                </span>
              </div>
              <a href={featuredNews.link} target="_blank" rel="noopener noreferrer" className="group block">
                <h3 className="font-serif font-bold text-xl md:text-2xl text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
                  {featuredNews.title}
                </h3>
                {featuredNews.description && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                    {featuredNews.description}
                  </p>
                )}
              </a>

              {/* Verification for featured */}
              {results[`${category}-0`] && (
                <VerdictBadge verification={results[`${category}-0`]} />
              )}

              <div className="flex gap-2 mt-3">
                {!results[`${category}-0`] && (
                  <Button variant="outline" size="sm" onClick={(e) => handleVerify(e, 0, featuredNews)} disabled={isVerifying === `${category}-0`} className="text-xs font-sans">
                    {isVerifying === `${category}-0` ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Verificando...</> : <><ShieldCheck className="w-3 h-3 mr-1" />Verificar</>}
                  </Button>
                )}
                <Button variant="default" size="sm" onClick={(e) => handleAnalyze(e, 0, featuredNews)} disabled={isAnalyzing === `${category}-0`} className="text-xs bg-verde hover:bg-verde-light font-sans">
                  {isAnalyzing === `${category}-0` ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Analisando...</> : <><FileText className="w-3 h-3 mr-1" />Analisar PDF</>}
                </Button>
              </div>
            </div>
          )}

          {/* Other Stories - newspaper column style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {otherNews?.map((item, i) => {
              const idx = i + 1;
              const newsId = `${category}-${idx}`;
              const verification = results[newsId];
              const isCurrentlyVerifying = isVerifying === newsId;
              const isCurrentlyAnalyzing = isAnalyzing === newsId;

              return (
                <div key={idx} className={cn(
                  "py-4 px-3",
                  // Newspaper column dividers
                  i % 2 === 0 ? "md:border-r md:border-border" : "",
                  "border-b border-border last:border-b-0"
                )}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary font-sans">
                      {item.source}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 font-sans">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(item.pubDate)}
                    </span>
                  </div>

                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block">
                    <h4 className="font-serif font-bold text-sm text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-muted-foreground font-body line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </a>

                  {verification && <VerdictBadge verification={verification} />}

                  <div className="flex gap-1.5 mt-2">
                    {!verification && (
                      <Button variant="ghost" size="sm" onClick={(e) => handleVerify(e, idx, item)} disabled={isCurrentlyVerifying || isCurrentlyAnalyzing} className="text-[10px] h-7 px-2 font-sans">
                        {isCurrentlyVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ShieldCheck className="w-3 h-3 mr-0.5" />Verificar</>}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e) => handleAnalyze(e, idx, item)} disabled={isCurrentlyAnalyzing || isCurrentlyVerifying} className="text-[10px] h-7 px-2 text-verde hover:text-verde-light font-sans">
                      {isCurrentlyAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <><FileText className="w-3 h-3 mr-0.5" />PDF</>}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AnalysisModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} />
    </div>
  );
}

function VerdictBadge({ verification }: { verification: { verdict: VerdictType; confidence: number; explanation: string; sources: string[] } }) {
  const config = verdictConfig[verification.verdict];
  const Icon = config.icon;
  return (
    <div className={cn("mt-2 p-2.5 rounded-lg border text-xs", config.className)}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="w-3.5 h-3.5" />
        <span className="font-bold font-sans">{config.label}</span>
        <span className="opacity-70 font-sans">({verification.confidence}%)</span>
      </div>
      <p className="opacity-90 font-body leading-relaxed">{verification.explanation}</p>
      {verification.sources.length > 0 && (
        <p className="mt-1 opacity-70 font-sans">Fontes: {verification.sources.join(", ")}</p>
      )}
    </div>
  );
}
