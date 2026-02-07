import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

export type NewsCategory = "geral" | "politica" | "economia" | "esportes" | "tecnologia" | "entretenimento";

export function useNews(category: NewsCategory = "geral") {
  return useQuery({
    queryKey: ["news", category],
    queryFn: async (): Promise<NewsItem[]> => {
      const { data, error } = await supabase.functions.invoke("fetch-news", {
        body: { category },
      });

      if (error) {
        console.error("Error fetching news:", error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch news");
      }

      return data.news;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 60 * 1000, // Atualiza a cada 10 minutos
  });
}
