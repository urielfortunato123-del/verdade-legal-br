import { useState } from "react";
import { callEdgeFunction } from "@/lib/supabase";
import { toast } from "sonner";

export interface FactCheckSource {
  nome: string;
  descricao: string;
  url?: string;
}

export interface FactCheckResponse {
  postResumo: string;
  veredito: "verdade" | "mentira" | "meia_verdade" | "inconclusivo";
  vereditoTitulo: string;
  explicacao: string;
  pontosChave: string[];
  fontes: FactCheckSource[];
  contexto?: string;
  dataVerificacao: string;
  confianca: number;
}

export function useFactCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FactCheckResponse | null>(null);

  const checkFact = async (claim: string): Promise<FactCheckResponse | null> => {
    setIsLoading(true);
    setResponse(null);

    try {
      const result = await callEdgeFunction<FactCheckResponse & { success: boolean; error?: string }>(
        "fact-check",
        { claim }
      );

      if (!result.success) {
        throw new Error(result.error || "Erro ao verificar afirmação");
      }

      const factCheckResponse: FactCheckResponse = {
        postResumo: result.postResumo,
        veredito: result.veredito,
        vereditoTitulo: result.vereditoTitulo,
        explicacao: result.explicacao,
        pontosChave: result.pontosChave || [],
        fontes: result.fontes || [],
        contexto: result.contexto,
        dataVerificacao: result.dataVerificacao,
        confianca: result.confianca,
      };

      setResponse(factCheckResponse);
      return factCheckResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro na verificação";
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResponse(null);
  };

  return {
    checkFact,
    isLoading,
    response,
    reset,
  };
}
