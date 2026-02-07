import { Button } from "@/components/ui/button";
import { Share2, Copy, Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { VerdictType } from "@/components/ui/VerdictBadge";

interface ShareButtonsProps {
  verdict?: VerdictType;
  summary: string;
  sources?: { law: string; article: string; url?: string }[];
  onDownloadPdf?: () => void;
}

const verdictEmojis: Record<VerdictType, string> = {
  confirmed: "✅",
  misleading: "⚠️",
  false: "❌",
  unverifiable: "❓",
};

const verdictLabels: Record<VerdictType, string> = {
  confirmed: "Confirmado",
  misleading: "Enganoso",
  false: "Falso",
  unverifiable: "Não verificável",
};

export function ShareButtons({
  verdict,
  summary,
  sources = [],
  onDownloadPdf,
}: ShareButtonsProps) {
  const generateShareText = () => {
    const emoji = verdict ? verdictEmojis[verdict] : "";
    const label = verdict ? verdictLabels[verdict] : "";
    
    let text = verdict ? `${emoji} ${label}\n\n` : "";
    text += `${summary}\n\n`;
    
    if (sources.length > 0) {
      text += "📚 Fontes:\n";
      sources.slice(0, 3).forEach((source) => {
        text += `• ${source.law}`;
        if (source.article) text += ` - ${source.article}`;
        text += "\n";
      });
    }
    
    text += "\n🔍 Verificado pelo Verdade na Lei BR";
    
    return text;
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      toast.success("Texto copiado!");
    } catch {
      toast.error("Erro ao copiar");
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Verdade na Lei BR - Verificação",
          text: generateShareText(),
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={shareViaWhatsApp}
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={shareNative}
      >
        <Share2 className="w-4 h-4" />
        Compartilhar
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={copyToClipboard}
      >
        <Copy className="w-4 h-4" />
        Copiar
      </Button>

      {onDownloadPdf && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onDownloadPdf}
        >
          <Download className="w-4 h-4" />
          PDF
        </Button>
      )}
    </div>
  );
}
