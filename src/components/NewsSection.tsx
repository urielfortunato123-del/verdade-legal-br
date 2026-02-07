import { useState } from "react";
import { useNews, NewsCategory } from "@/hooks/useNews";
import { useVerifyNews, VerdictType } from "@/hooks/useVerifyNews";
import { useAnalyzeNews, AnalysisResult } from "@/hooks/useAnalyzeNews";
import { AnalysisModal } from "@/components/AnalysisModal";
import {
  Newspaper,
  ExternalLink,
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
  { id: "entretenimento", label: "Entreter", icon: Film },
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

export function NewsSection() {
  const [category, setCategory] = useState<NewsCategory>("geral");
  const [modalData, setModalData] = useState<AnalysisResult | null>(null);
  const { data: news, isLoading, error, refetch, isFetching } = useNews(category);
  const { verify, isVerifying, results } = useVerifyNews();
  const { analyze, isAnalyzing, results: analysisResults } = useAnalyzeNews();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch {
      return "";
    }
  };

  const getSourceColor = (source: string) => {
    if (source.includes("G1")) return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300";
    if (source.includes("Folha")) return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300";
    if (source.includes("Metrópoles")) return "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300";
    if (source.includes("Oeste")) return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300";
    if (source.includes("Senado")) return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300";
    if (source.includes("UOL")) return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
    return "bg-muted text-muted-foreground";
  };

  const handleVerify = async (
    e: React.MouseEvent,
    idx: number,
    item: { title: string; description: string; source: string; link: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    await verify(`${category}-${idx}`, item.title, item.description, item.source, item.link);
  };

  const handleAnalyze = async (
    e: React.MouseEvent,
    idx: number,
    item: { title: string; description: string; source: string; link: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await analyze(`${category}-${idx}`, item.title, item.description, item.source, item.link);
    if (result) {
      setModalData(result);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-card-foreground text-lg">
              Notícias do Brasil
            </h2>
            <p className="text-sm text-muted-foreground">Atualizadas em tempo real</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
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
                ? "bg-verde text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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
            <div key={i} className="p-4 rounded-xl bg-muted/50 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground text-sm mb-3">
            Não foi possível carregar as notícias
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {news?.map((item, idx) => {
            const newsId = `${category}-${idx}`;
            const verification = results[newsId];
            const isCurrentlyVerifying = isVerifying === newsId;
            const isCurrentlyAnalyzing = isAnalyzing === newsId;

            return (
              <div 
                key={idx} 
                className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getSourceColor(item.source)}`}
                    >
                      {item.source}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.pubDate)}
                    </span>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="font-medium text-card-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    )}
                  </a>

                  {/* Verification Result */}
                  {verification && (
                    <div
                      className={cn(
                        "mt-2 p-3 rounded-xl border",
                        verdictConfig[verification.verdict].className
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {(() => {
                          const VerdictIcon = verdictConfig[verification.verdict].icon;
                          return <VerdictIcon className="w-4 h-4" />;
                        })()}
                        <span className="font-semibold text-sm">
                          {verdictConfig[verification.verdict].label}
                        </span>
                        <span className="text-xs opacity-70">
                          ({verification.confidence}% confiança)
                        </span>
                      </div>
                      <p className="text-xs opacity-90">{verification.explanation}</p>
                      {verification.sources.length > 0 && (
                        <div className="mt-1 text-xs opacity-70">
                          Fontes: {verification.sources.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {/* Verify Button */}
                    {!verification && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleVerify(e, idx, item)}
                        disabled={isCurrentlyVerifying || isCurrentlyAnalyzing}
                        className="text-xs"
                      >
                        {isCurrentlyVerifying ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            Verificando...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Verificar
                          </>
                        )}
                      </Button>
                    )}

                    {/* Analyze & PDF Button */}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => handleAnalyze(e, idx, item)}
                      disabled={isCurrentlyAnalyzing || isCurrentlyVerifying}
                      className="text-xs bg-verde hover:bg-verde-light"
                    >
                      {isCurrentlyAnalyzing ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3 mr-1" />
                          Analisar PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 flex-shrink-0 hidden sm:block"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        data={modalData}
      />
    </div>
  );
}
