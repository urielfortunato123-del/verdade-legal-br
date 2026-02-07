import { useState } from "react";
import { callEdgeFunction } from "@/lib/supabase";
import { toast } from "sonner";

export interface QuestionResponse {
  answer: string;
  sources: { law: string; article: string; url: string }[];
  confidence: "high" | "medium" | "low";
  category: string;
  followUp?: string;
}

export function useAnalyzeQuestion() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QuestionResponse | null>(null);

  const askQuestion = async (
    question: string,
    category?: string
  ): Promise<QuestionResponse | null> => {
    setIsLoading(true);
    setResponse(null);

    try {
      const result = await callEdgeFunction<QuestionResponse & { success: boolean; error?: string }>(
        "analyze-question",
        { question, category }
      );

      if (!result.success) {
        throw new Error(result.error || "Erro ao processar pergunta");
      }

      const questionResponse: QuestionResponse = {
        answer: result.answer,
        sources: result.sources,
        confidence: result.confidence,
        category: result.category,
        followUp: result.followUp,
      };

      setResponse(questionResponse);
      return questionResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro na consulta";
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    askQuestion,
    isLoading,
    response,
    setResponse,
  };
}
