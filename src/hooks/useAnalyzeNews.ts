import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface NewsAnalysis {
  resumo: string;
  contexto: string;
  pontosPrincipais: string[];
  analiseCritica: string;
  verificacao: {
    veredicto: "confirmed" | "misleading" | "false" | "unverifiable";
    confianca: number;
    explicacao: string;
  };
  fontesRecomendadas: string[];
}

export interface AnalysisResult {
  success: boolean;
  analysis: NewsAnalysis;
  newsData: {
    title: string;
    description: string;
    source: string;
    link: string;
  };
}

export function useAnalyzeNews() {
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, AnalysisResult>>({});

  const analyze = async (
    newsId: string,
    title: string,
    description: string,
    source: string,
    link: string
  ): Promise<AnalysisResult | null> => {
    setIsAnalyzing(newsId);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", {
        body: { title, description, source, link },
      });

      if (error) {
        console.error("Error analyzing news:", error);
        toast.error("Erro ao analisar notícia");
        return null;
      }

      if (!data.success) {
        toast.error(data.error || "Erro ao analisar notícia");
        return null;
      }

      const result = data as AnalysisResult;
      setResults((prev) => ({ ...prev, [newsId]: result }));
      return result;
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro ao conectar com o servidor");
      return null;
    } finally {
      setIsAnalyzing(null);
    }
  };

  return { analyze, isAnalyzing, results };
}
