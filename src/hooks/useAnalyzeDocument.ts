import { useState } from "react";
import { callEdgeFunction } from "@/lib/supabase";
import { toast } from "sonner";

export type VerdictType = "confirmed" | "misleading" | "false" | "unverifiable";

export interface Claim {
  text: string;
  verdict: VerdictType;
  explanation: string;
  sources?: { law: string; article: string; url: string }[];
}

export interface DocumentAnalysis {
  overallVerdict: VerdictType;
  summary: string;
  claims: Claim[];
}

export interface DocumentModeAnalysis {
  summary: string;
  keyInfo: { key: string; value: string }[];
  legalPoints: string[];
  relatedLaws: { law: string; article: string; relevance: string }[];
}

export function useAnalyzeDocument() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | DocumentModeAnalysis | null>(null);

  const analyze = async (
    text: string,
    mode: "news_tv" | "document"
  ): Promise<DocumentAnalysis | DocumentModeAnalysis | null> => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await callEdgeFunction<{
        success: boolean;
        analysis: DocumentAnalysis | DocumentModeAnalysis;
        error?: string;
      }>("analyze-document", { text, mode });

      if (!result.success) {
        throw new Error(result.error || "Análise falhou");
      }

      setAnalysis(result.analysis);
      return result.analysis;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro na análise";
      toast.error(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyze,
    isAnalyzing,
    analysis,
    setAnalysis,
  };
}
