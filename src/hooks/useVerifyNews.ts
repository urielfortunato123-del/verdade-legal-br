import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type VerdictType = "confirmed" | "misleading" | "false" | "unverifiable";

export interface VerificationResult {
  verdict: VerdictType;
  confidence: number;
  explanation: string;
  sources: string[];
}

export function useVerifyNews() {
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, VerificationResult>>({});

  const verify = async (newsId: string, title: string, description: string, source: string, link: string) => {
    setIsVerifying(newsId);

    try {
      const { data, error } = await supabase.functions.invoke("verify-news", {
        body: { title, description, source, link },
      });

      if (error) {
        console.error("Error verifying news:", error);
        toast.error("Erro ao verificar notícia");
        return null;
      }

      if (!data.success) {
        toast.error(data.error || "Erro ao verificar notícia");
        return null;
      }

      const result: VerificationResult = {
        verdict: data.verdict,
        confidence: data.confidence,
        explanation: data.explanation,
        sources: data.sources || [],
      };

      setResults((prev) => ({ ...prev, [newsId]: result }));
      return result;
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro ao verificar notícia");
      return null;
    } finally {
      setIsVerifying(null);
    }
  };

  return { verify, isVerifying, results };
}
