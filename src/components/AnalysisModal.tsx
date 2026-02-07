import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Share2,
  MessageCircle,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/hooks/useAnalyzeNews";
import {
  generateNewsPdf,
  sharePdf,
  shareText,
  canShareFiles,
  canShare,
} from "@/utils/generateNewsPdf";
import { toast } from "sonner";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalysisResult | null;
}

const verdictConfig = {
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle2,
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  misleading: {
    label: "Enganoso",
    icon: AlertTriangle,
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  false: {
    label: "Falso",
    icon: XCircle,
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  unverifiable: {
    label: "Não verificável",
    icon: HelpCircle,
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
};

export function AnalysisModal({ isOpen, onClose, data }: AnalysisModalProps) {
  const [isSharing, setIsSharing] = useState(false);

  if (!data) return null;

  const { analysis, newsData } = data;
  const verdict = analysis.verificacao;
  const VerdictIcon = verdictConfig[verdict.veredicto].icon;

  const handleDownload = () => {
    generateNewsPdf(data);
    toast.success("PDF salvo com sucesso!");
  };

  const handleSharePdf = async () => {
    setIsSharing(true);
    try {
      if (canShareFiles()) {
        const shared = await sharePdf(data);
        if (shared) {
          toast.success("Compartilhado com sucesso!");
        }
      } else if (canShare()) {
        const shared = await shareText(data);
        if (shared) {
          toast.success("Compartilhado com sucesso!");
        }
      } else {
        // Fallback: copy to clipboard
        const text = `📰 Análise: ${newsData.title}\n\nVeredicto: ${verdictConfig[verdict.veredicto].label}\n\n${verdict.explicacao}\n\nFonte: ${newsData.source}`;
        await navigator.clipboard.writeText(text);
        toast.success("Copiado para a área de transferência!");
      }
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Erro ao compartilhar");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📰 *Análise de Notícia*\n\n*${newsData.title}*\nFonte: ${newsData.source}\n\n✅ *Veredicto:* ${verdictConfig[verdict.veredicto].label} (${verdict.confianca}%)\n\n${verdict.explicacao}\n\n${newsData.link || ""}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold pr-8">
            Análise da Notícia
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* News Title */}
          <div>
            <h3 className="font-semibold text-sm">{newsData.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Fonte: {newsData.source}
            </p>
          </div>

          {/* Verdict Badge */}
          <div
            className={cn(
              "p-3 rounded-xl border",
              verdictConfig[verdict.veredicto].className
            )}
          >
            <div className="flex items-center gap-2">
              <VerdictIcon className="w-5 h-5" />
              <span className="font-bold">
                {verdictConfig[verdict.veredicto].label}
              </span>
              <span className="text-xs opacity-70">
                ({verdict.confianca}% confiança)
              </span>
            </div>
            <p className="text-sm mt-2 opacity-90">{verdict.explicacao}</p>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase mb-1">
              Resumo
            </h4>
            <p className="text-sm text-foreground/80">{analysis.resumo}</p>
          </div>

          {/* Key Points */}
          {analysis.pontosPrincipais?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-primary uppercase mb-1">
                Pontos Principais
              </h4>
              <ul className="space-y-1">
                {analysis.pontosPrincipais.map((ponto, idx) => (
                  <li key={idx} className="text-sm text-foreground/80 flex gap-2">
                    <span className="text-primary">•</span>
                    {ponto}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
            >
              <Download className="w-4 h-4" />
              Salvar PDF
            </button>

            <button
              onClick={handleSharePdf}
              disabled={isSharing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-foreground font-medium text-sm hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              Compartilhar
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
