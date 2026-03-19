import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  imageUrl: string | null;
}

export type NewsCategory = "geral" | "politica" | "economia" | "esportes" | "tecnologia" | "entretenimento" | "local";

export function useNews(category: NewsCategory = "geral", location?: { lat: number; lon: number } | null) {
  return useQuery({
    queryKey: ["news", category, location?.lat, location?.lon],
    queryFn: async (): Promise<NewsItem[]> => {
      const body: Record<string, unknown> = { category };
      if (category === "local" && location) {
        body.latitude = location.lat;
        body.longitude = location.lon;
      }

      const { data, error } = await supabase.functions.invoke("fetch-news", {
        body,
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
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    enabled: category !== "local" || !!location,
  });
}
