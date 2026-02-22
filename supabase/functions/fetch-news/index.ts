import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// RSS feeds de notícias brasileiras por categoria
const RSS_FEEDS: Record<string, { name: string; url: string; encoding?: string }[]> = {
  geral: [
    { name: "G1", url: "https://g1.globo.com/rss/g1/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/feed" },
    { name: "Folha de S.Paulo", url: "https://feeds.folha.uol.com.br/emcimadahora/rss091.xml" },
    { name: "Estadão", url: "https://www.estadao.com.br/rss/ultimas.xml" },
    { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/feed/rss/" },
    { name: "CartaCapital", url: "https://www.cartacapital.com.br/feed/" },
    { name: "Oeste", url: "https://revistaoeste.com/feed/" },
    { name: "UOL", url: "https://rss.uol.com.br/feed/noticias.xml" },
    { name: "Jovem Pan", url: "https://jovempan.com.br/feed" },
    { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/feed/" },
  ],
  politica: [
    { name: "G1 Política", url: "https://g1.globo.com/rss/g1/politica/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/brasil/politica-brasil/feed" },
    { name: "Folha Poder", url: "https://feeds.folha.uol.com.br/poder/rss091.xml" },
    { name: "Estadão Política", url: "https://www.estadao.com.br/rss/politica.xml" },
    { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/republica/feed/rss/" },
    { name: "CartaCapital", url: "https://www.cartacapital.com.br/politica/feed/" },
    { name: "Oeste", url: "https://revistaoeste.com/politica/feed/" },
    { name: "Senado", url: "https://www12.senado.leg.br/noticias/feed" },
    { name: "Jovem Pan", url: "https://jovempan.com.br/noticias/politica/feed" },
    { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/politica/feed/" },
  ],
  economia: [
    { name: "G1 Economia", url: "https://g1.globo.com/rss/g1/economia/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/negocios/feed" },
    { name: "Folha Mercado", url: "https://feeds.folha.uol.com.br/mercado/rss091.xml" },
    { name: "Estadão Economia", url: "https://www.estadao.com.br/rss/economia.xml" },
    { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/economia/feed/rss/" },
    { name: "Oeste", url: "https://revistaoeste.com/economia/feed/" },
    { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/economia/feed/" },
  ],
  esportes: [
    { name: "G1 Esportes", url: "https://g1.globo.com/rss/g1/esporte/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/esportes/feed" },
    { name: "Folha Esporte", url: "https://feeds.folha.uol.com.br/esporte/rss091.xml" },
    { name: "Oeste", url: "https://revistaoeste.com/esportes/feed/" },
    { name: "UOL Esporte", url: "https://rss.uol.com.br/feed/esporte.xml" },
  ],
  tecnologia: [
    { name: "G1 Tecnologia", url: "https://g1.globo.com/rss/g1/tecnologia/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/tecnologia/feed" },
    { name: "Folha Tec", url: "https://feeds.folha.uol.com.br/tec/rss091.xml" },
    { name: "UOL Tecnologia", url: "https://rss.uol.com.br/feed/tecnologia.xml" },
  ],
  entretenimento: [
    { name: "G1 Pop & Arte", url: "https://g1.globo.com/rss/g1/pop-arte/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/entretenimento/feed" },
    { name: "Folha Ilustrada", url: "https://feeds.folha.uol.com.br/ilustrada/rss091.xml" },
    { name: "UOL Entretenimento", url: "https://rss.uol.com.br/feed/entretenimento.xml" },
  ],
};

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

function parseRSSItem(item: string, source: string): NewsItem | null {
  try {
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/s);
    const linkMatch = item.match(/<link>(.*?)<\/link>/s);
    const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/s);
    const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/s);

    const title = titleMatch ? (titleMatch[1] || titleMatch[2])?.trim() : null;
    const link = linkMatch ? linkMatch[1]?.trim() : null;
    const description = descMatch ? (descMatch[1] || descMatch[2])?.trim() : "";
    const pubDate = dateMatch ? dateMatch[1]?.trim() : new Date().toISOString();

    if (!title || !link) return null;

    // Limpar HTML do description e corrigir encoding
    const cleanDescription = description
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/\]\]>/g, "")
      .substring(0, 200)
      .trim();

    return {
      title,
      link,
      description: cleanDescription,
      pubDate,
      source,
    };
  } catch {
    return null;
  }
}

async function fetchRSSFeed(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${sourceName}: ${response.status}`);
      return [];
    }

    // Get as ArrayBuffer and decode with proper encoding
    const buffer = await response.arrayBuffer();
    let xml: string;
    
    // Check content-type header for encoding hints
    const contentType = response.headers.get("content-type") || "";
    
    // Folha uses ISO-8859-1, check URL or content-type
    const isFolha = feedUrl.includes("folha.uol.com.br");
    const isLatin1 = contentType.toLowerCase().includes("iso-8859-1") || 
                     contentType.toLowerCase().includes("latin1") ||
                     isFolha;
    
    if (isLatin1) {
      xml = new TextDecoder("iso-8859-1").decode(buffer);
    } else {
      // First decode as UTF-8
      xml = new TextDecoder("utf-8").decode(buffer);
      
      // Check XML declaration for encoding
      const encodingMatch = xml.match(/<\?xml[^>]+encoding=["']([^"']+)["']/i);
      const declaredEncoding = encodingMatch?.[1]?.toLowerCase();
      
      if (declaredEncoding === "iso-8859-1" || declaredEncoding === "latin1") {
        xml = new TextDecoder("iso-8859-1").decode(buffer);
      } else if (xml.includes("\uFFFD")) {
        // Fallback: if we see replacement characters, try Latin-1
        xml = new TextDecoder("iso-8859-1").decode(buffer);
      }
    }
    
    const items: NewsItem[] = [];

    // Extrair itens do RSS
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g);
    if (!itemMatches) return [];

    for (const itemXml of itemMatches.slice(0, 5)) {
      const parsed = parseRSSItem(itemXml, sourceName);
      if (parsed) items.push(parsed);
    }

    return items;
  } catch (error) {
    console.error(`Error fetching ${sourceName}:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Pegar categoria do body (se houver)
    let category = "geral";
    try {
      const body = await req.json();
      if (body.category && RSS_FEEDS[body.category]) {
        category = body.category;
      }
    } catch {
      // Sem body, usar categoria geral
    }

    console.log(`Fetching news from RSS feeds (category: ${category})...`);

    const feeds = RSS_FEEDS[category] || RSS_FEEDS.geral;

    // Buscar de todos os feeds em paralelo
    const feedPromises = feeds.map((feed) =>
      fetchRSSFeed(feed.url, feed.name)
    );

    const results = await Promise.all(feedPromises);
    const allNews = results.flat();

    // Ordenar por data (mais recentes primeiro)
    allNews.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    // Limitar a 15 notícias
    const news = allNews.slice(0, 15);

    console.log(`Fetched ${news.length} news items for category: ${category}`);

    return new Response(
      JSON.stringify({ success: true, news, category }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
