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
  confirmed: "CONFIRMADO",
  misleading: "ENGANOSO",
  false: "FALSO",
  unverifiable: "NÃO VERIFICÁVEL",
};

const verdictDescriptions: Record<VerdictType, string> = {
  confirmed: "Essa informação está de acordo com a lei vigente.",
  misleading: "A informação divulgada simplifica a lei e omite condições importantes.",
  false: "Não existe base legal que sustente essa afirmação.",
  unverifiable: "Não há dados suficientes para confirmar essa informação com base legal.",
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
    const description = verdict ? verdictDescriptions[verdict] : "";
    
    let text = verdict ? `${emoji} ${label}\n\n` : "";
    text += verdict ? `${description}\n\n` : "";
    text += `${summary}\n\n`;
    
    if (sources.length > 0) {
      text += "📚 Fontes:\n";
      sources.slice(0, 3).forEach((source) => {
        text += `• ${source.law}`;
        if (source.article) text += `, ${source.article}`;
        text += "\n";
      });
    }
    
    text += "\n🔍 Verificado pelo Verdade na Lei BR\n";
    text += "Informação, não manipulação.";
    
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
        if ((err as Error).name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        className="gap-2 bg-[hsl(145_70%_40%)] hover:bg-[hsl(145_70%_35%)] text-white font-semibold rounded-xl"
        onClick={shareViaWhatsApp}
      >
        <MessageCircle className="w-5 h-5" />
        WhatsApp
      </Button>

      <Button
        variant="outline"
        className="gap-2 rounded-xl font-semibold"
        onClick={shareNative}
      >
        <Share2 className="w-5 h-5" />
        Compartilhar
      </Button>

      <Button
        variant="outline"
        className="gap-2 rounded-xl font-semibold"
        onClick={copyToClipboard}
      >
        <Copy className="w-5 h-5" />
        Copiar
      </Button>

      {onDownloadPdf && (
        <Button
          variant="outline"
          className="gap-2 rounded-xl font-semibold"
          onClick={onDownloadPdf}
        >
          <Download className="w-5 h-5" />
          Salvar PDF
        </Button>
      )}
    </div>
  );
}
